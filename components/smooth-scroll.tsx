"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    let frame = 0;
    let scrollLocked = false;
    const syncLock = () => {
      const active = document.documentElement.dataset.splash === "active" || document.documentElement.dataset.rewinding === "true";
      if (active !== scrollLocked) { scrollLocked = active; if (active) lenis.stop(); else lenis.start(); }
    };
    const nativeReturn = () => { lenis.stop(); lenis.resize(); if (!scrollLocked) lenis.start(); };
    const rewindScroll = (event: Event) => {
      const top = (event as CustomEvent<number>).detail;
      if (typeof top === "number" && Number.isFinite(top)) lenis.scrollTo(top, { immediate: true, force: true });
    };
    const returnStep = (event: Event) => {
      const delta = (event as CustomEvent<number>).detail;
      if (scrollLocked || typeof delta !== "number" || !Number.isFinite(delta)) return;
      event.preventDefault();
      // Limit accumulated travel too: a burst of trackpad events cannot queue a
      // whole trip home after the visitor has already stopped moving their fingers.
      const target = Math.max(lenis.actualScroll - innerHeight * 1.25, lenis.targetScroll + delta, 0);
      lenis.scrollTo(target, { duration: .42 });
    };
    window.addEventListener("mind-native-return", nativeReturn);
    window.addEventListener("mind-rewind-state", syncLock);
    window.addEventListener("mind-rewind-scroll", rewindScroll);
    window.addEventListener("mind-return-step", returnStep);
    const raf = (time: number) => {
      syncLock();
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mind-native-return", nativeReturn);
      window.removeEventListener("mind-rewind-state", syncLock);
      window.removeEventListener("mind-rewind-scroll", rewindScroll);
      window.removeEventListener("mind-return-step", returnStep);
      lenis.destroy();
    };
  }, []);

  return null;
}
