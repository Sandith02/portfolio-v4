"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const lines = ["The same gradient.", "The same cards.", "The same motion.", "A different logo."];

export function ScrollManifesto() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".manifesto-line");
      items.forEach((item, index) => {
        const next = items[index + 1];
        gsap.fromTo(item,
          { opacity: index === 0 ? 1 : .08, transform: "translate3d(0, 22vh, 0) rotate(2deg) scale(.84)" },
          {
            opacity: 1,
            transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "top 42%",
              scrub: 1
            }
          }
        );
        if (next) {
          gsap.to(item, {
            opacity: .08,
            transform: "translate3d(0, -18vh, 0) scale(1.1)",
            scrollTrigger: {
              trigger: next,
              start: "top 82%",
              end: "top 45%",
              scrub: 1
            }
          });
        }
      });
      gsap.fromTo(".manifesto-resolution",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          scrollTrigger: {
            trigger: ".manifesto-resolution",
            start: "top 80%",
            end: "top 40%",
            scrub: 1
          }
        }
      );
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="scroll-manifesto" ref={root}>
      <div className="manifesto-intro">
        <p>AI made building faster.</p>
        <p>It did not make taste automatic.</p>
      </div>
      <div className="manifesto-lines">
        {lines.map((line) => <div className="manifesto-line" key={line}>{line}</div>)}
        <div className="manifesto-resolution">I build differently.</div>
      </div>
      <p className="manifesto-foot">Strategy, development, interaction and enough unnecessary attention to detail to make the finished thing feel like yours.</p>
    </section>
  );
}
