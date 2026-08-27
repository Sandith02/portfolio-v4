"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { projects } from "@/lib/data";
import { ArrowUpRight } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

export function WorkRail() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !section.current) return;
    const context = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".project-scene");
      scenes.forEach((scene, index) => {
        if (index === scenes.length - 1) return;
        gsap.to(scene.querySelector(".project-scene-inner"), {
          transform: "translate3d(0, 0, " + (-180 - index * 35) + "px) scale(" + (.86 - index * .025) + ") rotateX(4deg)",
          opacity: .28,
          ease: "none",
          scrollTrigger: {
            trigger: scenes[index + 1],
            start: "top bottom",
            end: "top top",
            scrub: 1
          }
        });
      });
    }, section);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="work-deck" ref={section} aria-label="Selected work">
      {projects.map((project, index) => (
        <article className="project-scene" key={project.slug}>
          <div className="project-scene-inner">
            <div className="project-scene-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.alt} loading="lazy" />
            </div>
            <div className="project-scene-overlay" />
            <div className="project-scene-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="project-scene-copy">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <a href={"/work#" + project.slug}>View project <ArrowUpRight size={18} weight="bold" /></a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
