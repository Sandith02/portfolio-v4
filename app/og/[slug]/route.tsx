import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { seoPages, type SeoPage } from "@/lib/seo";
import { threads, getThread } from "@/content/threads";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(seoPages), ...threads.map(thread => thread.slug)].map(slug => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thread = getThread(slug);
  const page = thread ? { headline: thread.sharingHeadline, label: "Threads · By Sandith Sithmaka Thenuwara" } : Object.hasOwn(seoPages, slug) ? seoPages[slug as SeoPage] : null;
  if (!page) return new Response("Not found", { status: 404 });
  const [displayFont, bodyFont] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/@fontsource/megrim/files/megrim-latin-400-normal.woff")),
    readFile(join(process.cwd(), "node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff")),
  ]);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#090c0f", color: "#e4e8e7", fontFamily: "Plex", position: "relative" }}>
      <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="haze"><stop offset="0%" stopColor="#8ca5b2" stopOpacity=".14" /><stop offset="100%" stopColor="#090c0f" stopOpacity="0" /></radialGradient>
          <radialGradient id="planet" cx="32%" cy="26%" r="80%"><stop offset="0%" stopColor="#778686" /><stop offset="36%" stopColor="#29383f" /><stop offset="76%" stopColor="#11191f" /><stop offset="100%" stopColor="#090c0f" /></radialGradient>
          <linearGradient id="orbit"><stop offset="0%" stopColor="#d2e7df" stopOpacity=".05" /><stop offset="50%" stopColor="#d2e7df" stopOpacity=".75" /><stop offset="100%" stopColor="#d2e7df" stopOpacity=".12" /></linearGradient>
        </defs>
        <ellipse cx="945" cy="300" rx="480" ry="470" fill="url(#haze)" />
        {Array.from({ length: 170 }, (_, i) => <circle key={i} cx={(i * 233 + 37) % 1200} cy={(i * i * 17 + i * 71 + 23) % 630} r={i % 17 === 0 ? 1.6 : .7} fill="#c9d6d7" opacity={.12 + (i % 5) * .07} />)}
        <g transform="translate(950 310) rotate(-28)">
          <ellipse rx="228" ry="80" fill="none" stroke="url(#orbit)" strokeWidth="2" />
          <circle r="146" fill="url(#planet)" stroke="#a8c7c0" strokeOpacity=".22" />
          <ellipse rx="230" ry="85" fill="none" stroke="url(#orbit)" strokeWidth="1" />
          <ellipse rx="216" ry="73" fill="none" stroke="url(#orbit)" strokeWidth=".7" />
          <ellipse rx="242" ry="95" fill="none" stroke="#9eb7b5" strokeOpacity=".16" />
        </g>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", padding: "58px 68px", width: "100%", position: "relative" }}>
        <div style={{ display: "flex", fontSize: 25, letterSpacing: "-.6px" }}>Sandith Sithmaka</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
          {page.headline.split("\n").map(line => <div key={line} style={{ display: "flex", fontFamily: "Megrim", fontSize: 82, lineHeight: 1.12 }}>{line}</div>)}
          <div style={{ display: "flex", fontSize: 18, color: "#a8b6bc", marginTop: 26 }}>{page.label}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, color: "#99a9ae" }}>
          <span>Sri Lanka · Open to the world</span><span>sandithdev.com</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Megrim", data: displayFont, style: "normal", weight: 400 }, { name: "Plex", data: bodyFont, style: "normal", weight: 400 }], headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800", "X-Robots-Tag": "noindex" } },
  );
}
