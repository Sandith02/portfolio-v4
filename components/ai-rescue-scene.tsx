"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { LinkArrow } from "@/components/link-arrow";

gsap.registerPlugin(ScrollTrigger);

export function AiRescueScene() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=1900",
          pin: ".rescue-stage",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      timeline
        .to(".mess-card-a", { transform: "translate3d(-70vw, -30vh, 0) rotate(-24deg)", opacity: 0, ease: "none" }, 0)
        .to(".mess-card-b", { transform: "translate3d(65vw, -40vh, 0) rotate(30deg)", opacity: 0, ease: "none" }, .05)
        .to(".mess-card-c", { transform: "translate3d(-50vw, 45vh, 0) rotate(18deg)", opacity: 0, ease: "none" }, .1)
        .to(".mess-card-d", { transform: "translate3d(60vw, 45vh, 0) rotate(-22deg)", opacity: 0, ease: "none" }, .12)
        .to(".rescue-before", { opacity: 0, transform: "translateY(-12vh)", ease: "none" }, .18)
        .to(".rescue-after", { opacity: 1, transform: "translateY(0) scale(1)", ease: "none" }, .28)
        .to(".rescue-rule", { transform: "scaleX(1)", ease: "none" }, .35)
        .to(".rescue-after span", { opacity: 1, transform: "translateY(0)", stagger: .08, ease: "none" }, .45)
        .to(".rescue-cta", { opacity: 1, transform: "translateY(0)", ease: "none" }, .68);
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <section className="rescue-story" ref={root}>
      <div className="rescue-stage">
        <div className="rescue-before">Your AI website was a good first draft.</div>
        <div className="mess-card mess-card-a">Another gradient</div>
        <div className="mess-card mess-card-b">Rounded card</div>
        <div className="mess-card mess-card-c">Generic headline</div>
        <div className="mess-card mess-card-d">Mobile TBD</div>
        <div className="rescue-after">
          <span>Keep the speed.</span>
          <span>Lose the AI look.</span>
          <div className="rescue-rule" />
        </div>
        <div className="rescue-cta">
          <p>I redesign and rebuild generated websites into experiences that feel deliberate, fast and connected to the brand.</p>
          <LinkArrow href="/ai-website-redesign" inverse>Fix my AI website</LinkArrow>
        </div>
      </div>
    </section>
  );
}
