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
        <div className="inner-topline"><span>Sandith Sithmaka / A world within</span><span>Move a little closer.</span></div>
        <h1 className="inner-accessible-title" id="hero-title">Sandith Sithmaka. Quiet outside. Never quiet inside.</h1>
        <div className="inner-story" aria-hidden="true">
          <div className="inner-chapter inner-chapter-first"><p>The things I never say.</p><span>Quiet<br /><em>outside.</em></span></div>
          <div className="inner-chapter inner-chapter-second"><p>There was never nothing.</p><span>Never quiet<br /><em>inside.</em></span></div>
          <div className="inner-chapter inner-chapter-last"><p>Beyond the silence.</p><span>Still<br /><em>here.</em></span></div>
        </div>
        <p className="inner-description">Independent developer.<br />A different kind of presence.</p>
        <div className="inner-bottom">
          <a className="inner-scroll" href="#introduction"><ArrowDown size={14} /><span>Scroll inward</span></a>
          <Link className="inner-enter" href="/work">Discover the work <ArrowUpRight size={14} /></Link>
          <button className="inner-motion" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Resume atmosphere" : "Pause atmosphere"}>
            {paused ? <Play size={10} weight="fill" /> : <Pause size={10} weight="fill" />}<span>{paused ? "Resume" : "Stillness"}</span>
          </button>
        </div>
        <div className="inner-progress" aria-hidden="true"><span /></div>
        <a className="inner-credits" href="/models/inner-world-credits.txt" target="_blank" rel="noreferrer">Figure: Lee Perry-Smith / CC BY 3.0</a>
      </div>
    </section>
  );
}
