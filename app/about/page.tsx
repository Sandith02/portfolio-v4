import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { LinkArrow } from "@/components/link-arrow";

export const metadata: Metadata = {
  title: "About Sandith | Full-Stack Developer Sri Lanka",
  description: "Meet Sandith, a full-stack developer from Sri Lanka working across Next.js, React, web applications, creative development and digital products."
};

const stack = ["Next.js", "React", "TypeScript", "JavaScript", "Node.js", "Java", "Spring Boot", "MySQL", "REST APIs", "Tailwind CSS", "Git", "Vercel", "Sanity", "Figma"];

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">About</p>
          <h1 className="display">Hi. I’m Sandith.</h1>
        </div>
        <div className="page-hero-foot">
          <p className="body-xl">A full-stack developer and creative working where software engineering meets visual experimentation.</p>
          <div className="page-hero-actions"><LinkArrow href="/contact">Tell me about it</LinkArrow></div>
        </div>
      </section>

      <section className="section shell about-portrait">
        <Reveal>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/workspace.jpg" alt="Creative developer workspace with laptop and large monitor" />
          </figure>
        </Reveal>
        <Reveal className="about-portrait-copy" delay={0.08}>
          <p className="body-xl">My background is in Computer Science, but I’ve always cared about the visual side of technology as much as the technical side.</p>
          <p className="body-lg muted">That combination became websites, business tools, event experiences and digital products where code and design have to work together.</p>
          <p className="body-lg muted">Tools change. Taste travels surprisingly well.</p>
        </Reveal>
      </section>

      <section className="section shell">
        <Reveal className="short-version">
          <span>I develop.</span>
          <span>I design.</span>
          <span>I experiment.</span>
          <span>I break things.</span>
          <span>I make them better.</span>
          <span>Repeat.</span>
        </Reveal>
      </section>

      <section className="section shell stack-columns">
        <Reveal>
          <h2 className="display-sm">Things I use when necessary.</h2>
          <div className="stack-cloud">{stack.map((item) => <span key={item}>{item}</span>)}</div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display-sm">Things I use constantly.</h2>
          <div className="stack-cloud"><span>Curiosity</span><span>Google</span><span>Inspect Element</span><span>Undo</span></div>
        </Reveal>
      </section>

      <section className="section shell big-cta">
        <Reveal><h2 className="display">Enough about me. What are you building?</h2></Reveal>
        <Reveal className="big-cta-bottom">
          <p className="body-xl">A website, a product or something that does not fit neatly into either category.</p>
          <LinkArrow href="/contact">Tell me about it</LinkArrow>
        </Reveal>
      </section>
    </main>
  );
}
