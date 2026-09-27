"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import type { InnerWorldScene } from "@/lib/inner-world-scene";

function ConstructedTitle({ lines, offset = 0 }: { lines: [string, string]; offset?: number }) {
  const title = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let disposed = false;
    // Wait for Megrim so the construction never runs in a fallback typeface.
    document.fonts.ready.then(() => {
      if (!disposed && title.current) title.current.dataset.construct = "true";
    });
    return () => { disposed = true; };
  }, []);

  return (
    <span className="inner-headline constructed-title" ref={title} aria-hidden="true">
      {lines.map((line, row) => (
        <span className="constructed-line" key={line}>
          {Array.from(line).map((letter, index) => (
            <span className="constructed-letter" key={index} style={{
              "--build-delay": `${offset + row * 160 + ((index * 3) % 5) * 65}ms`,
            } as CSSProperties}>
              <span className="constructed-letter-final">{letter}</span>
              {[0, 1, 2, 3].map(piece => (
                <span className={`constructed-piece constructed-piece-${piece}`} key={piece}>
                  <span>{letter}</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const controller = useRef<InnerWorldScene | null>(null);

  useEffect(() => {
    const host = viewport.current;
    const hero = root.current;
    if (!host || !hero) return;
    const abort = new AbortController();
    import("@/lib/inner-world-scene")
      .then(({ createInnerWorldScene }) => createInnerWorldScene(host, hero, abort.signal))
      .then(scene => {
        if (abort.signal.aborted) { scene.dispose(); return; }
        controller.current = scene;
      })
      .catch(error => {
        if (error.name !== "AbortError") { host.dataset.ready = "false"; hero.dataset.fallback = "true"; }
      });
    return () => { abort.abort(); controller.current?.dispose(); controller.current = null; };
  }, []);

  return (
    <section className="cinematic-hero inner-hero" ref={root} aria-labelledby="hero-title">
      <div className="cinematic-stage">
        <div className="inner-viewport" ref={viewport} aria-hidden="true"><div className="inner-poster" /></div>
        <div className="inner-vignette" aria-hidden="true" />
        <div className="inner-topline"><span>I’m Sandith Sithmaka<span className="inner-topline-role">Creative developer</span></span></div>
        <h1 className="inner-accessible-title" id="hero-title">Sandith Sithmaka — Creative developer. Quiet outside. Worlds within.</h1>
        <div className="inner-story">
          <div className="inner-chapter inner-chapter-first">
            <div className="inner-chapter-left"><ConstructedTitle lines={["Quiet", "outside."]} /><p className="inner-title-note">I leave a lot unsaid.<br />A curious mind might find the rest.</p></div>
            <div className="inner-chapter-right"><ConstructedTitle lines={["Worlds", "within."]} offset={180} /></div>
          </div>
          <div className="inner-chapter inner-chapter-second" aria-hidden="true">
            <div className="inner-chapter-left"><ConstructedTitle lines={["Always", "looking."]} /></div>
            <div className="inner-chapter-right"><ConstructedTitle lines={["Never", "ordinary."]} offset={180} /></div>
          </div>
          <div className="inner-chapter inner-chapter-last" aria-hidden="true">
            <div className="inner-chapter-left"><ConstructedTitle lines={["Strange", "ideas."]} /></div>
            <div className="inner-chapter-right"><ConstructedTitle lines={["Real", "things."]} offset={180} /></div>
          </div>
        </div>
        <div className="inner-opportunity"><a href="mailto:hello@sandithdev.com?subject=Creative%20developer%20role">Open to creative roles <ArrowUpRight size={16} /></a></div>
        <div className="inner-bottom">
          <a className="inner-linkedin" href="https://www.linkedin.com/in/sandith02/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Sandith on LinkedIn (opens in a new tab)">
            <Image className="inner-linkedin-brand" src="/images/linkedin-in-official.png" width={20} height={17} alt="" unoptimized />
            <span><span className="inner-linkedin-prefix">Connect on </span>LinkedIn</span>
            <span className="inner-linkedin-arrow"><ArrowUpRight size={14} aria-hidden="true" /></span>
          </a>
          <Link className="inner-enter" href="/work">Explore my work <ArrowUpRight size={16} /></Link>
          <a className="inner-scroll" href="#introduction" aria-label="Scroll inward" title="Scroll inward"><ArrowDown size={18} /></a>
        </div>
        <div className="inner-progress" aria-hidden="true"><span /></div>
        <a className="inner-credits" href="/models/inner-world-credits.txt" target="_blank" rel="noreferrer">Figure: Lee Perry-Smith / CC BY 3.0</a>
      </div>
    </section>
  );
}
