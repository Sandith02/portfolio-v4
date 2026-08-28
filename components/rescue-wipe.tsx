"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { LinkArrow } from "@/components/link-arrow";

gsap.registerPlugin(ScrollTrigger);

export function RescueWipe() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current || window.matchMedia("(max-width: 767px)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".rescue-finished",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1
          }
        }
      );
      gsap.to(".rescue-photo", {
        transform: "scale(1.12)",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 }
      });
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="rescue-wipe" ref={root}>
      <div className="rescue-wipe-stage">
        <div className="rescue-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/design-review.jpg" alt="" />
        </div>
        <div className="rescue-generated">
          <span>Generated quickly.</span>
          <p>Same gradient. Same cards. Same website with a different logo.</p>
        </div>
        <div className="rescue-finished">
          <span>Finished properly.</span>
          <h2>Keep the speed.<br />Lose the AI look.</h2>
          <div className="rescue-finished-bottom">
            <p>I keep what works, then rebuild the design, code and experience around the brand.</p>
            <LinkArrow href="/ai-website-redesign" inverse>Fix my AI website</LinkArrow>
          </div>
        </div>
      </div>
    </section>
  );
}
