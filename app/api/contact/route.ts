import { createHmac } from "node:crypto";
import { validateContact } from "../../../lib/contact";

export const runtime = "nodejs";
export const maxDuration = 15;
const MAX_BODY_BYTES = 32768;
const unavailable = "Your message couldn’t be sent right now. Please try again or email me directly.";
const json = (data: object, status: number, headers: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ error: "Please send your message from the contact page." }, 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return json({ error: "Please send your message using the contact form." }, 415);
  }
  // Bound the actual stream, not just the caller-controlled Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Your message is empty." }, 400);
  let input: Record<string, unknown>;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return json({ error: "Your message is too long. Please keep it under 5,000 characters." }, 413);
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "Please check your message and try again." }, 400);
    input = parsed as Record<string, unknown>;
  } catch { return json({ error: "Please check your message and try again." }, 400); }
  finally { reader.releaseLock(); }

  if (input.website) return json({ error: "Please leave the website field empty." }, 422);
  const { data, errors, valid } = validateContact(input);
  if (!valid) return json({ error: "Please check the highlighted fields.", errors }, 422);
  if (typeof input.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId)) {
    return json({ error: "Please refresh the page before sending your message." }, 400);
  }

  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    console.error("Contact backend is missing its Supabase configuration.");
    return json({ error: unavailable }, 503);
  }
  try {
    const url = new URL("/rest/v1/rpc/submit_contact_inquiry", base);
    if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname))) throw new Error("Invalid backend URL");
    // Only trust Vercel's overwritten client-IP header on a Vercel deployment.
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : null;
    const fingerprint = ip ? createHmac("sha256", process.env.CONTACT_RATE_LIMIT_SECRET || key).update(`contact:${ip}`).digest("hex") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json", apikey: key };
    if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
    const response = await fetch(url, {
      method: "POST", headers, cache: "no-store", signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ p_id: input.submissionId, p_name: data.name, p_email: data.email, p_company: data.company || null, p_topic: data.topic || null, p_message: data.message, p_fingerprint: fingerprint }),
    });
    const result = await response.json();
    if (!response.ok) {
      if (result.code === "P0001") return json({ error: "You’ve sent a few messages recently. Please try again in an hour, or email me directly." }, 429, { "Retry-After": "3600" });
      if (result.code === "P0002") return json({ error: "Please refresh the page before sending a new message." }, 409);
      // Never log inquiry contents, database error details, or credentials.
      console.error("Contact database request failed.", response.status);
      return json({ error: unavailable }, 503);
    }
    if (result !== input.submissionId) throw new Error("Unconfirmed inquiry");
    return json({ ok: true }, 201);
  } catch {
    console.error("Contact database request could not be completed.");
    return json({ error: unavailable }, 503);
  }
}
