"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export function FilmWork() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current || !track.current || window.matchMedia("(max-width: 767px)").matches) return;
    const context = gsap.context(() => {
      const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
      gsap.to(track.current, {
        transform: () => "translate3d(" + -distance() + "px, 0, 0)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      gsap.utils.toArray<HTMLElement>(".film-image img").forEach((image) => {
        gsap.fromTo(image,
          { transform: "scale(1.18) translate3d(-4%, 0, 0)" },
          {
            transform: "scale(1.05) translate3d(4%, 0, 0)",
            ease: "none",
            scrollTrigger: { trigger: image, containerAnimation: undefined, start: "left right", end: "right left", scrub: true }
          }
        );
      });
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="film-work" ref={root}>
      <header className="film-header">
        <p>Selected work</p>
        <h2>Proof, not promises.</h2>
      </header>
      <div className="film-track" ref={track}>
        {projects.map((project, index) => (
          <article className="film-frame" key={project.slug}>
            <a className="film-image" href={"/work#" + project.slug} aria-label={"View " + project.category}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.alt} />
              <span className="film-index">{String(index + 1).padStart(2, "0")}</span>
            </a>
            <div className="film-copy">
              <p>{project.category}</p>
              <h3>{project.title}</h3>
              <a href={"/work#" + project.slug}>Open project <ArrowUpRight size={17} weight="bold" /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
