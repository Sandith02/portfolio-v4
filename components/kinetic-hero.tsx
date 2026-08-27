"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { LinkArrow } from "@/components/link-arrow";

gsap.registerPlugin(ScrollTrigger);

export function KineticHero() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const context = gsap.context(() => {
      gsap.from(".kinetic-line", {
        transform: "translateY(42px)",
        opacity: 0,
        duration: 1.15,
        stagger: 0.07,
        ease: "power4.out"
      });
      gsap.from(".hero-portal img", {
        transform: "scale(1.28)",
        opacity: 0,
        duration: 1.4,
        ease: "power4.out"
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=1500",
          pin: ".kinetic-stage",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(".kinetic-word-a", { transform: "translate3d(-12vw, -12vh, 0) scale(.7)", opacity: .14, ease: "none" }, 0)
        .to(".kinetic-word-b", { transform: "translate3d(16vw, -2vh, 0) scale(1.14)", ease: "none" }, 0)
        .to(".kinetic-word-c", { transform: "translate3d(-8vw, 14vh, 0) scale(1.22)", ease: "none" }, 0)
        .to(".hero-portal", { transform: "rotate(-4deg) scale(1.48)", clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
        .to(".kinetic-meta", { opacity: 0, transform: "translateY(-40px)", ease: "none" }, 0)
        .to(".kinetic-end", { opacity: 1, transform: "translateY(0)", ease: "none" }, .58);
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="kinetic-hero" ref={root}>
      <div className="kinetic-stage">
        <div className="kinetic-meta">
          <span>Full-stack developer + creative</span>
          <span>Selected freelance work worldwide</span>
        </div>
        <div className="hero-portal" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/workspace.jpg" alt="" />
        </div>
        <h1 className="kinetic-title">
          <span className="kinetic-line"><span className="kinetic-word kinetic-word-a">Making</span></span>
          <span className="kinetic-line align-right"><span className="kinetic-word kinetic-word-b">one worth</span></span>
          <span className="kinetic-line"><span className="kinetic-word kinetic-word-c">remembering.</span></span>
        </h1>
        <div className="kinetic-bottom">
          <p>Anyone can generate a website now. Making it feel unmistakably yours is the harder, more interesting part.</p>
          <div className="kinetic-actions">
            <LinkArrow href="/work">View the work</LinkArrow>
            <LinkArrow href="/ai-website-redesign">Fix my AI website</LinkArrow>
          </div>
        </div>
        <div className="kinetic-end" aria-hidden="true">AI made it fast.<br /><span>I make it good.</span></div>
      </div>
    </section>
  );
}
