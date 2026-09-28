import { createHmac } from "node:crypto";
import { answerError } from "../../../lib/thread-answer";
import { getThread } from "../../../content/threads";

export const runtime = "nodejs";
export const maxDuration = 15;
const MAX_BODY_BYTES = 100000;
const unavailable = "Your answer couldn’t be sent right now. Please try again.";
const json = (data: object, status: number, headers: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ error: "Please send your answer from the thread page." }, 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return json({ error: "Please send your answer using the answer form." }, 415);
  }
  // Bound the actual stream, not just the caller-controlled Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Your answer is empty." }, 400);
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
        return json({ error: "Your answer is too long. Please keep it within 500 words." }, 413);
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "Please check your answer and try again." }, 400);
    input = parsed as Record<string, unknown>;
  } catch { return json({ error: "Please check your answer and try again." }, 400); }
  finally { reader.releaseLock(); }

  if (input.website) return json({ error: "Please leave the website field empty." }, 422);
  const thread = typeof input.slug === "string" ? getThread(input.slug) : undefined;
  if (!thread) return json({ error: "This thread could not be found." }, 404);
  const answer = typeof input.answer === "string" ? input.answer.trim() : "";
  const error = answerError(answer);
  if (error) return json({ error }, 422);
  if (typeof input.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId)) {
    return json({ error: "Please refresh the page before sending your answer." }, 400);
  }

  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    console.error("Thread answer backend is missing its Supabase configuration.");
    return json({ error: unavailable }, 503);
  }
  try {
    const url = new URL("/rest/v1/rpc/submit_thread_answer", base);
    if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname))) throw new Error("Invalid backend URL");
    // Only trust Vercel's overwritten client-IP header on a Vercel deployment.
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : null;
    const fingerprint = createHmac("sha256", process.env.CONTACT_RATE_LIMIT_SECRET || key).update(`thread-answer:${ip || "unknown"}`).digest("hex");
    const headers: Record<string, string> = { "Content-Type": "application/json", apikey: key };
    if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
    const response = await fetch(url, {
      method: "POST", headers, cache: "no-store", signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ p_id: input.submissionId, p_slug: thread.slug, p_title: thread.title, p_question: thread.paragraphs[thread.paragraphs.length - 1], p_answer: answer, p_fingerprint: fingerprint }),
    });
    const result = await response.json();
    if (!response.ok) {
      if (result.code === "P0001") return json({ error: "You’ve sent a few answers recently. Please try again in an hour." }, 429, { "Retry-After": "3600" });
      if (result.code === "P0002") return json({ error: "Please refresh the page before sending a new answer." }, 409);
      // Never log inquiry contents, database error details, or credentials.
      console.error("Thread answer database request failed.", response.status);
      return json({ error: unavailable }, 503);
    }
    if (result !== input.submissionId) throw new Error("Unconfirmed inquiry");
    return json({ ok: true }, 201);
  } catch {
    console.error("Thread answer database request could not be completed.");
    return json({ error: unavailable }, 503);
  }
}
