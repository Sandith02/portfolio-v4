import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { seoPages, type SeoPage } from "@/lib/seo";
import { threads, getThread } from "@/content/threads";
import { AUTHOR_NAME } from "@/lib/identity";

export const dynamic = "force-static";
export const dynamicParams = false;

const sectionNames: Record<SeoPage, string> = {
  home: "Inside my mind", about: "About", work: "Work",
  contact: "Contact", why: "Why", threads: "Threads",
};

export function generateStaticParams() {
  return [...Object.keys(seoPages), ...threads.map(thread => thread.slug)].map(slug => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thread = getThread(slug);
  const page = Object.hasOwn(seoPages, slug) ? seoPages[slug as SeoPage] : null;
  if (!thread && !page) return new Response("Not found", { status: 404 });
  const headline = thread?.title ?? page!.headline.replace(/\n/g, " ");
  const section = thread ? "Threads" : sectionNames[slug as SeoPage];

  const [displayFont, bodyFont, galaxy] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/@fontsource/megrim/files/megrim-latin-400-normal.woff")),
    readFile(join(process.cwd(), "lib/og-assets/manrope-latin-400-normal.woff")),
    readFile(join(process.cwd(), "lib/og-assets/galaxy.jpg")),
  ]);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0d0f", color: "#e4e8e7", fontFamily: "Manrope", position: "relative" }}>
      {/* Same sky as the portfolio, embedded so generation needs no remote assets. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={`data:image/jpeg;base64,${galaxy.toString("base64")}`} width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
      <div style={{ display: "flex", position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,13,15,0.72), rgba(11,13,15,0.3) 65%, rgba(11,13,15,0.12))" }} />
      <div style={{ display: "flex", flexDirection: "column", padding: "48px 64px 40px", width: "100%", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }}>
          <div style={{ display: "flex", fontFamily: "Megrim", fontSize: 40, color: "#b7c1c3" }}>
            {section.toUpperCase()}
          </div>
          <svg width="48" height="48" viewBox="0 0 64 64">
            <ellipse cx="32" cy="32" rx="26" ry="8" transform="rotate(-32 32 32)" fill="none" stroke="#b7c1c3" strokeWidth="2" />
            <circle cx="32" cy="32" r="14" fill="#0e1114" stroke="#b7c1c3" strokeWidth="2" />
            <path d="M6 32a26 8 0 0 0 52 0" transform="rotate(-32 32 32)" fill="none" stroke="#b7c1c3" strokeWidth="2" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", paddingBottom: 16 }}>
          <div style={{ display: "flex", fontSize: headline.length > 52 ? 72 : 80, lineHeight: 1.13, letterSpacing: "-3px", maxWidth: 1000 }}>
            {headline}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(202,215,217,0.24)", paddingTop: 24 }}>
          <div style={{ display: "flex", fontSize: 24 }}>{AUTHOR_NAME}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#aeb8bd" }}>sandithdev.com</div>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Megrim", data: displayFont, style: "normal", weight: 400 }, { name: "Manrope", data: bodyFont, style: "normal", weight: 400 }], headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800", "X-Robots-Tag": "noindex" } },
  );
}
