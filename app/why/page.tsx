import type { Metadata } from "next";
import { LinkArrow } from "@/components/link-arrow";

export const metadata: Metadata = {
  title: "Why I create | Sandith",
  description: "Somewhere between art and code. This is where the quiet goes.",
};

export default function WhyPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Why</p>
          <h1 className="display">This is where<br />the quiet goes.</h1>
        </div>
        <div className="page-hero-foot">
          <p className="body-xl">I leave a lot unsaid. What I couldn’t say, I made.</p>
          <div className="page-hero-actions"><LinkArrow href="/work">See what I make</LinkArrow></div>
        </div>
      </section>
      <section className="section shell big-cta">
        <h2 className="display">Somewhere between<br />art and code.</h2>
        <div className="big-cta-bottom">
          <p className="body-xl">A quiet outside. A restless world within. Room to imagine, experiment, and find my own form.</p>
          <LinkArrow href="/about">The person behind it</LinkArrow>
        </div>
      </section>
    </main>
  );
}
