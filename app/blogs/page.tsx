import type { Metadata } from "next";
import { LinkArrow } from "@/components/link-arrow";

export const metadata: Metadata = {
  title: "Threads | Sandith",
  description: "Thoughts on design, code and the things in between, by Sandith Sithmaka.",
};

export default function BlogsPage() {
  return (
    <main id="main-content" className="blogs-page">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Threads</p>
          <h1>Thoughts<br />put into words.</h1>
          <p className="body-lg muted">Notes on design, code and the things in between.</p>
        </div>
        <div className="page-hero-foot">
          <div className="blogs-empty"><span className="eyebrow">The first entry</span><p className="body-xl">Still taking shape.</p><p className="muted">My articles will live here.</p></div>
          <div className="page-hero-actions"><LinkArrow href="/">Back to my universe</LinkArrow></div>
        </div>
      </section>
    </main>
  );
}
