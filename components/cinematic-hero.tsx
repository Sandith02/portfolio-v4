"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { LinkArrow } from "@/components/link-arrow";

gsap.registerPlugin(ScrollTrigger);

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current || window.matchMedia("(max-width: 767px)").matches) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
      timeline
        .to(".hero-line-first", { transform: "translate3d(-10vw, -5vh, 0)", opacity: .12, ease: "none" }, 0)
        .to(".hero-line-second", { transform: "translate3d(11vw, 4vh, 0)", opacity: .12, ease: "none" }, 0)
        .to(".cinematic-image", { transform: "scale(1.18)", clipPath: "inset(0 0 0 0)", ease: "none" }, 0)
        .to(".hero-support", { opacity: 0, transform: "translateY(-30px)", ease: "none" }, 0)
        .to(".hero-endline", { opacity: 1, transform: "translate(-50%, -50%)", ease: "none" }, .5);
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="cinematic-hero" ref={root}>
      <div className="cinematic-stage">
        <div className="hero-labels">
          <span>Sandith Sithmaka</span>
          <span>Developer + creative</span>
        </div>
        <div className="cinematic-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/corporate.jpg" alt="Angular contemporary architecture in afternoon light" />
        </div>
        <h1 className="cinematic-title">
          <span className="hero-line-first">Anyone can build one.</span>
          <span className="hero-line-second">Few are worth remembering.</span>
        </h1>
        <div className="hero-support">
          <p>Custom websites, digital products and rescued AI builds with a real point of view.</p>
          <div>
            <LinkArrow href="/work" inverse>View the work</LinkArrow>
            <LinkArrow href="/contact" inverse>Start something</LinkArrow>
          </div>
        </div>
        <div className="hero-endline" aria-hidden="true">
          <span>AI made it fast.</span>
          <strong>I make it good.</strong>
        </div>
      </div>
    </section>
  );
}
