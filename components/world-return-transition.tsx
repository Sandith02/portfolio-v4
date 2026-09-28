"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WORLD_RETURN_EVENT, WORLD_RETURN_DURATION_MS, worldReturn } from "@/lib/world-navigation";
import styles from "./world-return-transition.module.css";

// Lives in the root layout so the starfield bridges the route change and waits
// for the actual galaxy renderer, rather than uncovering an empty canvas.
export function WorldReturnTransition() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const overlay = root.current;
    if (!overlay) return;
    let active = false;
    let observer: MutationObserver | undefined;
    let source: HTMLElement | null = null;
    let sourceWasInert = false;
    let overflow = "";
    let departure: Animation | undefined;
    let revealFrame = 0;
    const timers = new Set<number>();
    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    const finish = () => {
      observer?.disconnect();
      cancelAnimationFrame(revealFrame);
      timers.forEach(timer => window.clearTimeout(timer)); timers.clear();
      departure?.cancel();
      if (source) source.inert = sourceWasInert;
      if (active) document.body.style.overflow = overflow;
      active = false;
      delete overlay.dataset.phase;
      delete document.documentElement.dataset.worldReturning;
      delete document.documentElement.dataset.worldReturnReady;
      window.dispatchEvent(new Event("mind-rewind-state"));
    };
    const start = (event: Event) => {
      const world = (event as CustomEvent<string>).detail;
      const destination = worldReturn(`#${world}-world`);
      if (!destination || active) return;
      active = true;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.dataset.worldReturning = world;
      window.dispatchEvent(new Event("mind-rewind-state"));
      source = document.getElementById("main-content");
      sourceWasInert = source?.inert ?? false;
      if (source) {
        source.inert = true;
        if (!reduced) departure = source.animate([
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(.97)" },
        ], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
      }
      overlay.dataset.phase = "departing";
      let arriving = false;
      const reveal = () => {
        const hero = document.querySelector<HTMLElement>(`.inner-hero[data-return-world="${world}"]`);
        if (arriving || !hero || (hero.dataset.returnReady !== "true" && hero.dataset.fallback !== "true")) return;
        arriving = true;
        observer?.disconnect();
        // Let the positioned galaxy frame reach the compositor before uncovering it.
        revealFrame = requestAnimationFrame(() => {
          revealFrame = requestAnimationFrame(() => {
            if (!active) return;
            document.documentElement.dataset.worldReturnReady = "true";
            hero.dataset.returnArrival = String(performance.now());
            overlay.dataset.phase = "arriving";
            later(() => {
              finish();
              const link = hero.querySelector<HTMLAnchorElement>(`.planet-link[data-planet="${world === "threads" ? "Threads" : world[0].toUpperCase() + world.slice(1)}"]`);
              if (link && !link.closest("[inert]") && hero.dataset.fallback !== "true") link.focus({ preventScroll: true });
              else document.querySelector<HTMLElement>('.nav-home')?.focus({ preventScroll: true });
            }, reduced ? 0 : WORLD_RETURN_DURATION_MS);
          });
        });
      };
      later(() => {
        observer = new MutationObserver(reveal);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-return-ready", "data-fallback", "data-return-world"] });
        router.push(`/#${world}-world`, { scroll: false });
        reveal();
      }, reduced ? 0 : 420);
      // A failed navigation must never leave the visitor behind an overlay.
      later(finish, 12000);
    };
    window.addEventListener(WORLD_RETURN_EVENT, start);
    window.addEventListener("popstate", finish);
    return () => {
      finish();
      window.removeEventListener(WORLD_RETURN_EVENT, start);
      window.removeEventListener("popstate", finish);
    };
  }, [router]);

  return <div ref={root} className={styles.transition} aria-hidden="true" />;
}
