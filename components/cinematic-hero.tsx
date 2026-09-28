"use client";

import { useEffect, useRef } from "react";
import { ConstructedTitle } from "@/components/constructed-title";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import type { InnerWorldScene } from "@/lib/inner-world-scene";
import { worldReturn } from "@/lib/world-navigation";
import { createReturnToSurface } from "@/lib/return-to-surface";


export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const viewport = useRef<HTMLDivElement>(null);
  const controller = useRef<InnerWorldScene | null>(null);

  useEffect(() => {
    const host = viewport.current;
    const hero = root.current;
    if (!host || !hero) return;
    const destination = worldReturn(window.location.hash);
    if (destination) hero.dataset.returnWorld = destination.world;
    const abort = new AbortController();
    const returnToSurface = createReturnToSurface(hero);
    const entered = (event: Event) => { router.push((event as CustomEvent<string>).detail); };
    hero.addEventListener("planet-entered", entered);
    import("@/lib/inner-world-scene")
      .then(({ createInnerWorldScene }) => createInnerWorldScene(host, hero, abort.signal))
      .then(scene => {
        if (abort.signal.aborted) { scene.dispose(); return; }
        controller.current = scene;
      })
      .catch(error => {
        if (error.name !== "AbortError") { host.dataset.ready = "false"; hero.dataset.fallback = "true"; }
      });
    return () => { returnToSurface.dispose(); hero.removeEventListener("planet-entered", entered); abort.abort(); controller.current?.dispose(); controller.current = null; };
  }, [router]);

  return (
    <section className="cinematic-hero inner-hero" ref={root} aria-labelledby="hero-title">
      <div className="cinematic-stage">
        <div className="inner-viewport" ref={viewport} aria-hidden="true"><div className="inner-poster" /></div>
        <div className="inner-vignette" aria-hidden="true" />
        <div className="inner-topline"><span>I’m Sandith Sithmaka<span className="inner-topline-role">Creative developer</span></span></div>
        <h1 className="inner-accessible-title" id="hero-title">Sandith Sithmaka, design engineer and creative frontend developer. Quiet outside. Worlds within.</h1>
        <div className="inner-story">
          <div className="inner-chapter inner-chapter-first">
            <div className="inner-chapter-left"><ConstructedTitle lines={["Quiet", "outside."]} /><p className="inner-title-note">I leave a lot unsaid.<br />A curious mind might find the rest.</p></div>
            <div className="inner-chapter-right"><ConstructedTitle lines={["Worlds", "within."]} offset={180} /></div>
          </div>
          <div className="inner-chapter inner-chapter-second" aria-hidden="true">
            <div className="inner-chapter-left"><ConstructedTitle lines={["Always", "looking."]} /></div>
            <div className="inner-chapter-right"><ConstructedTitle lines={["Never", "ordinary."]} offset={180} /></div>
          </div>
        </div>
        <section className="mind-invitation" aria-labelledby="mind-invitation-title" aria-hidden="true" inert>
          <h2 id="mind-invitation-title" aria-label="Somewhere only I know."><ConstructedTitle lines={["Somewhere", "only I know."]} /></h2>
          <p>Beyond this point is my own galaxy. Each world holds a different part of me. Wander between them. Turn them. Step inside. You might catch an idea igniting or feel a little turbulence. Things are still taking shape in here.</p>
        </section>
        <nav className="planet-navigation" aria-label="Explore my worlds" aria-hidden="true" inert>
          <div className="planet-introduction"><h2 aria-label="Inside my mind."><ConstructedTitle lines={["Inside my mind."]} /></h2><p>Each world, a different part of me.</p></div>
          {[
            ["Work", "/work", "Things I made"],
            ["About", "/about", "The person behind it"],
            ["Contact", "/contact", "A place to connect"],
            ["Why", "/why", "What moves me"],
            ["Threads", "/blogs", "Thoughts taking shape"],
          ].map(([label, href, description]) => (
            <a className="planet-link" href={href} draggable={false} aria-describedby="planet-controls" data-planet={label} key={label} aria-label={`Enter ${label}: ${description}`}>
              <span className="planet-label"><span>{label}<ArrowUpRight size={16} /></span><small>{description}</small></span>
            </a>
          ))}
          <p className="planet-controls" id="planet-controls">Scroll to wander <span>·</span> Drag to turn <span>·</span> Click to enter<span className="inner-accessible-title">. When a planet is focused, use the arrow keys to turn it or Enter to go inside.</span></p>
        </nav>
        <div className="mind-boundary" aria-hidden="true">
          <p>You’ve seen a part of me.</p>
          <h2 aria-label="The rest stays within."><ConstructedTitle lines={["The rest", "stays within."]} /></h2>
        </div>
        <footer className="galaxy-footer" aria-label="Journey footer" aria-hidden="true" inert>
          <div className="galaxy-footer-main">
            <div className="galaxy-footer-copy">
              <h2><span>Still</span> <span>becoming.</span></h2>
              <p>Have a place for a mind like mine?</p>
            </div>
            <a className="galaxy-footer-hello" href="mailto:hello@sandithdev.com">
              <span>Let’s talk</span><span className="galaxy-footer-arrow"><ArrowUpRight size={18} aria-hidden="true" /></span>
            </a>
          </div>
          <div className="galaxy-footer-bottom">
            <span className="galaxy-footer-signature">© {new Date().getFullYear()} Sandith Sithmaka</span>
            <nav aria-label="Final scene links">
              <a href="https://www.linkedin.com/in/sandith02/" target="_blank" rel="noopener noreferrer" aria-label="Sandith on LinkedIn (opens in a new tab)">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a>
              <button type="button" onClick={() => root.current?.dispatchEvent(new Event("return-to-surface"))}>Back to the surface <ArrowUpRight size={13} aria-hidden="true" /></button>
            </nav>
          </div>
        </footer>
        <div className="planet-entry-veil" aria-hidden="true" />
        <span className="planet-status inner-accessible-title" role="status" />
        <div className="inner-opportunity"><Link href="/contact#contact-form">Connect with me <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        <div className="inner-bottom">
          <a className="inner-linkedin" href="https://www.linkedin.com/in/sandith02/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Sandith on LinkedIn (opens in a new tab)">
            <Image className="inner-linkedin-brand" src="/images/linkedin-in-official.png" width={20} height={17} alt="" unoptimized />
            <span><span className="inner-linkedin-prefix">Connect on </span>LinkedIn</span>
            <span className="inner-linkedin-arrow"><ArrowUpRight size={14} aria-hidden="true" /></span>
          </a>
          <button className="inner-scroll" type="button" aria-label="Scroll inward" title="Scroll inward" onClick={() => {
            const hero = root.current;
            if (hero) window.scrollTo({ top: hero.offsetTop + (viewport.current?.clientHeight ?? window.innerHeight) * 3.4, behavior: "smooth" });
          }}><ArrowDown size={18} /></button>
        </div>
        <a className="inner-credits" href="/models/inner-world-credits.txt" target="_blank" rel="noreferrer">Figure: Lee Perry-Smith / CC BY 3.0</a>
      </div>
    </section>
  );
}
