"use client";

import { useEffect, useRef, useState } from "react";

export function MindSplash() {
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const dismiss = useRef<() => void>(() => {});

  useEffect(() => {
    const element = root.current, host = canvas.current;
    if (!element || !host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("mind-intro-seen") === "true"; } catch { /* Private browsing can deny storage. */ }
    if (seen || reduced) {
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
      try { sessionStorage.setItem("mind-intro-seen", "true"); } catch { /* The intro still completes. */ }
      element.dataset.leaving = "true";
      closeTimer = window.setTimeout(() => setVisible(false), 850);
    };
    dismiss.current = close;
    const skip = element.querySelector("button");
    skip?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") { event.preventDefault(); skip?.focus(); }
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
    <div className="mind-splash" ref={root} role="dialog" aria-modal="true" aria-label="A mind in motion. Opening Sandith’s portfolio." data-lenis-prevent>
      <div className="mind-splash-canvas" ref={canvas} aria-hidden="true" />
      <div className="mind-splash-shade" aria-hidden="true" />
      <div className="mind-splash-top"><span>Sandith Sithmaka</span><button type="button" onClick={() => dismiss.current()}>Skip intro <span aria-hidden="true">↗</span></button></div>
      <div className="mind-splash-caption"><p>A mind<br /><em>in motion.</em></p><span>Quiet outside. Worlds within.</span></div>
      <div className="mind-splash-status" role="status"><i aria-hidden="true" /><span>Gathering thoughts</span></div>
      <noscript><style>{`.mind-splash{display:none}`}</style></noscript>
    </div>
  );
}
