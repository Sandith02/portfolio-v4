"use client";

import { useEffect, useRef, useState } from "react";
import { worldReturn } from "@/lib/world-navigation";
import { ConstructedTitle } from "@/components/constructed-title";
import { hasEnteredThisDocument, skipIntroOnNavigation } from "@/lib/intro-navigation";

export function MindSplash() {
  const [visible, setVisible] = useState(() => !hasEnteredThisDocument());
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const skipIntro = useRef<boolean | null>(null);

  useEffect(() => {
    const element = root.current, host = canvas.current;
    if (!element || !host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Retain the decision across Strict Mode's effect replay.
    if (skipIntro.current === null) skipIntro.current = reduced || !!worldReturn(window.location.hash) || hasEnteredThisDocument();
    skipIntroOnNavigation();
    if (skipIntro.current) {
      element.hidden = true;
      const timer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timer);
    }
    let disposed = false, leaving = false, closeTimer = 0;
    let scene: { dispose(): void } | undefined;
    const oldOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = Array.from(document.querySelectorAll<HTMLElement>(".skip-link, .site-header, #main-content, .site-footer"));
    const previousInert = background.map(node => node.inert);
    background.forEach(node => { node.inert = true; });
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.splash = "active";
    const started = performance.now();
    const close = () => {
      if (leaving || disposed) return;
      leaving = true;
      element.dataset.leaving = "true";
      closeTimer = window.setTimeout(() => setVisible(false), 850);
    };
    element.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") { event.preventDefault(); element.focus(); }
    };
    document.addEventListener("keydown", escape);
    import("@/lib/mind-splash-scene").then(({ createMindSplashScene }) => {
      if (!disposed && !leaving) { scene = createMindSplashScene(host); element.dataset.ready = "true"; }
    }).catch(() => { element.dataset.ready = "fallback"; });
    const timer = window.setInterval(() => {
      const age = performance.now() - started;
      const heroReady = document.querySelector('.inner-viewport[data-ready="true"]');
      if ((age > 5200 && heroReady) || age > 9000) close();
    }, 150);
    return () => {
      disposed = true;
      window.clearInterval(timer); window.clearTimeout(closeTimer);
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = oldOverflow;
      delete document.documentElement.dataset.splash;
      background.forEach((node, i) => { node.inert = previousInert[i]; });
      if (element.contains(document.activeElement)) previousFocus?.focus({ preventScroll: true });
      scene?.dispose();
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div className="mind-splash" ref={root} role="dialog" tabIndex={-1} aria-modal="true" aria-label="Quiet outside. Worlds within. Opening Sandith’s portfolio." data-lenis-prevent>
      <div className="mind-splash-canvas" ref={canvas} aria-hidden="true" />
      <picture className="mind-splash-art">
        <source media="(max-width: 600px)" srcSet="/images/mind-splash-glass-mobile.webp" />
        {/* Art-directed portrait source keeps both hands visible on mobile. */}
        <img src="/images/mind-splash-glass.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" />
      </picture>
      <div className="mind-splash-shade" aria-hidden="true" />
      <div className="mind-splash-caption"><p aria-label="Sandith Sithmaka"><ConstructedTitle lines={["Sandith Sithmaka"]} offset={450} /></p><span>Quiet outside. Worlds within.</span></div>
      <noscript><style>{`.mind-splash{display:none}`}</style></noscript>
    </div>
  );
}
