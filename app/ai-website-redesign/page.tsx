import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { Reveal } from "@/components/reveal";
import { LinkArrow } from "@/components/link-arrow";
import { rescueItems } from "@/lib/data";

export const metadata = pageMetadata("redesign");

export default function AiRescuePage() {
  return (
    <main id="main-content">
      <PageStructuredData page="redesign" />
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">AI website redesign</p>
          <h1 className="display">Your AI website needs a second pair of eyes.</h1>
        </div>
        <div className="page-hero-foot">
          <p className="body-xl">Generated quickly. Finished properly. I improve the design, code and experience without rebuilding blindly.</p>
          <div className="page-hero-actions"><LinkArrow href="/contact#contact-form">Fix my AI website</LinkArrow></div>
        </div>
      </section>

      <div className="image-break">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/design-review.jpg" alt="Designer reviewing a website layout on a desktop screen" />
        <div className="image-break-copy">Keep the speed. Lose the generated look.</div>
      </div>

      <section className="section shell">
        <Reveal>
          <h2 className="display-md">If there’s code, we can work with it.</h2>
          <div className="tools-line" aria-label="Supported AI development tools">
            {["Lovable", "Bolt", "v0", "Replit", "Claude", "ChatGPT", "Cursor", "Something else"].map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        </Reveal>
      </section>

      <section className="section-tight shell">
        <Reveal><h2 className="display-md">What gets fixed.</h2></Reveal>
        <div className="rescue-grid">
          {rescueItems.map(([title, copy], index) => (
            <Reveal className="rescue-card" key={title} delay={(index % 3) * 0.04}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section shell big-cta">
        <Reveal><h2 className="display">AI did the first 80%. Make the last 20% count.</h2></Reveal>
        <Reveal className="big-cta-bottom">
          <p className="body-xl">Send the existing site, the repo or the original prompt. I’ll tell you what is worth keeping.</p>
          <LinkArrow href="/contact#contact-form">Send me your website</LinkArrow>
        </Reveal>
      </section>
    </main>
  );
}
