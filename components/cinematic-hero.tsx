"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Pause, Play } from "@phosphor-icons/react";
import type { InnerWorldScene } from "@/lib/inner-world-scene";

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const controller = useRef<InnerWorldScene | null>(null);
  const [paused, setPaused] = useState(false);

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
        scene.setPaused(hero.dataset.paused === "true");
      })
      .catch(error => {
        if (error.name !== "AbortError") { host.dataset.ready = "false"; hero.dataset.fallback = "true"; }
      });
    return () => { abort.abort(); controller.current?.dispose(); controller.current = null; };
  }, []);

  useEffect(() => { controller.current?.setPaused(paused); }, [paused]);

  return (
    <section className="cinematic-hero inner-hero" ref={root} data-paused={paused} aria-labelledby="hero-title">
      <div className="cinematic-stage">
        <div className="inner-viewport" ref={viewport} aria-hidden="true"><div className="inner-poster" /></div>
        <div className="inner-vignette" aria-hidden="true" />
        <div className="inner-grain" aria-hidden="true" />
        <div className="inner-topline"><span>I’m Sandith Sithmaka<span className="inner-topline-role">Creative developer</span></span></div>
        <h1 className="inner-accessible-title" id="hero-title">Sandith Sithmaka — Creative developer. Quiet outside. Worlds within.</h1>
        <div className="inner-story">
          <div className="inner-chapter inner-chapter-first">
            <div className="inner-chapter-left"><span className="inner-headline" aria-hidden="true">Quiet<br />outside.</span><p className="inner-title-note">I leave a lot unsaid.<br />A curious mind might find the rest.</p></div>
            <div className="inner-chapter-right"><span className="inner-headline" aria-hidden="true">Worlds<br />within.</span></div>
          </div>
          <div className="inner-chapter inner-chapter-second" aria-hidden="true">
            <div className="inner-chapter-left"><span className="inner-headline">Always<br />looking.</span></div>
            <div className="inner-chapter-right"><span className="inner-headline">Never<br />ordinary.</span></div>
          </div>
          <div className="inner-chapter inner-chapter-last" aria-hidden="true">
            <div className="inner-chapter-left"><span className="inner-headline">Strange<br />ideas.</span></div>
            <div className="inner-chapter-right"><span className="inner-headline">Real<br />things.</span></div>
          </div>
        </div>
        <div className="inner-opportunity"><a href="mailto:hello@sandithdev.com?subject=Creative%20developer%20role">Open to creative roles <ArrowUpRight size={16} /></a></div>
        <div className="inner-bottom">
          <a className="inner-scroll" href="#introduction" aria-label="Scroll inward" title="Scroll inward"><ArrowDown size={18} /></a>
          <Link className="inner-enter" href="/work">Explore my work <ArrowUpRight size={16} /></Link>
          <button className="inner-motion" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Resume atmosphere" : "Pause atmosphere"}>
            {paused ? <Play size={10} weight="fill" /> : <Pause size={10} weight="fill" />}
          </button>
        </div>
        <div className="inner-progress" aria-hidden="true"><span /></div>
        <a className="inner-credits" href="/models/inner-world-credits.txt" target="_blank" rel="noreferrer">Figure: Lee Perry-Smith / CC BY 3.0</a>
      </div>
    </section>
  );
}
