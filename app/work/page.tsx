import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { LinkArrow } from "@/components/link-arrow";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Web Development Projects & Portfolio | Sandith Dev",
  description: "Explore websites, web applications, frontend projects and digital experiences built by full-stack developer Sandith Sithmaka."
};

export default function WorkPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Work</p>
          <h1 className="display">Evidence.</h1>
        </div>
        <div className="page-hero-foot">
          <p className="body-xl">Websites, platforms, digital products and experiments. Some probably involved more debugging than the screenshot suggests.</p>
          <div className="page-hero-actions"><LinkArrow href="/contact">Start something</LinkArrow></div>
        </div>
      </section>

      <section className="section shell project-list">
        {projects.map((project) => (
          <article className="project-item" id={project.slug} key={project.slug}>
            <Reveal className="project-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.alt} loading="lazy" />
            </Reveal>
            <Reveal className="project-info" delay={0.06}>
              <span className="eyebrow">{project.category}</span>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <LinkArrow href="/contact">See the breakdown</LinkArrow>
            </Reveal>
          </article>
        ))}
      </section>
    </main>
  );
}
