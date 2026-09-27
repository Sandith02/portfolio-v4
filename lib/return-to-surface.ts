import { RETURN_DURATION_MS } from "./journey-stops";

// Return directly through the worlds from 95% to the opening galaxy view.
export function createReturnToSurface(hero: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let automatic = false, returning = false, disposed = false, frame = 0, started = 0;
  let touchY = 0, destination = 0;
  let rewindFrom = 0, upwardIntentUntil = 0, previousY = window.scrollY;
  const viewportHeight = () => hero.querySelector<HTMLElement>(".cinematic-stage")?.clientHeight ?? innerHeight;
  const percent = () => window.scrollY / Math.max(1, hero.offsetHeight - viewportHeight()) * 100;
  const atReturnEdge = () => percent() >= 94.5 && percent() <= 95.5;
  const nearEnd = (percent = 91) => {
    const range = Math.max(1, hero.offsetHeight - viewportHeight());
    return Math.round(window.scrollY / range * 100) >= percent && !document.querySelector('.mind-splash:not([hidden])');
  };
  const editable = (target: EventTarget | null) => target instanceof Element && !!target.closest('input, textarea, select, [contenteditable="true"], .nav-panel');
  const finish = () => {
    automatic = false; returning = false; cancelAnimationFrame(frame); delete hero.dataset.returning;
    delete hero.dataset.rewindProgress;
    delete document.documentElement.dataset.rewinding;
    upwardIntentUntil = 0; previousY = window.scrollY;
    window.dispatchEvent(new Event("mind-rewind-state"));
  };
  const cancel = () => {
    window.dispatchEvent(new Event("mind-native-return"));
    window.scrollTo({ top: window.scrollY, behavior: "instant" });
    finish();
  };
  const watch = () => {
    if (disposed || !automatic) return;
    if (Math.abs(window.scrollY - destination) < 2 || performance.now() - started > 6000) {
      finish();
      if (window.scrollY < 2 && document.activeElement instanceof HTMLElement && document.activeElement.closest(".galaxy-footer")) {
        const title = hero.querySelector<HTMLElement>("#hero-title");
        if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
      }
    } else frame = requestAnimationFrame(watch);
  };
  const goTo = (top: number) => {
    if (automatic || disposed) return;
    finish(); automatic = true; destination = top; started = performance.now();
    hero.dataset.returning = top > 0 ? "galaxy" : "automatic";
    window.dispatchEvent(new Event("mind-native-return"));
    window.scrollTo({ top, behavior: reduced.matches ? "instant" : "smooth" });
    frame = requestAnimationFrame(watch);
  };
  const start = () => goTo(0);
  const driveScroll = (top: number) => {
    window.scrollTo({ top, behavior: "instant" });
    window.dispatchEvent(new CustomEvent("mind-rewind-scroll", { detail: top }));
  };
  const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  const rewind = (now: number) => {
    if (!automatic || disposed) return;
    const t = Math.min(1, (now - started) / RETURN_DURATION_MS);
    hero.dataset.rewindProgress = String(t);
    // One continuous return; the finale cloud and beam sequence is skipped.
    const top = rewindFrom + (destination - rewindFrom) * smooth(t);
    driveScroll(top);
    if (t >= 1) finish(); else frame = requestAnimationFrame(rewind);
  };
  const rewindToGalaxy = () => {
    if (automatic || disposed || document.querySelector('.mind-splash:not([hidden])')) return;
    const galaxyOpening = hero.offsetTop + 3.3 * viewportHeight();
    if (reduced.matches) { goTo(galaxyOpening); return; }
    finish(); automatic = true; rewindFrom = window.scrollY;
    destination = galaxyOpening;
    hero.dataset.returning = "rewind-galaxy"; hero.dataset.rewindProgress = "0";
    document.documentElement.dataset.rewinding = "true";
    window.dispatchEvent(new Event("mind-rewind-state"));
    started = performance.now(); frame = requestAnimationFrame(rewind);
  };
  const scrolled = () => {
    const y = window.scrollY;
    const edge = (hero.offsetHeight - viewportHeight()) * .95;
    if (!automatic && performance.now() < upwardIntentUntil && y < previousY && previousY >= edge && y <= edge) rewindToGalaxy();
    previousY = y;
  };
  const step = (delta: number) => {
    if (reduced.matches || delta >= 0 || window.scrollY < 2) return false;
    if (!returning && !nearEnd()) return false;
    returning = true; hero.dataset.returning = "controlled";
    const strength = Math.min(1, Math.abs(delta) / 120);
    const landing = Math.max(0, Math.min(1, (window.scrollY / innerHeight - 2) / 5));
    const multiplier = 1 + 4 * strength * strength * landing;
    const distance = -Math.min(Math.abs(delta) * multiplier, innerHeight * .9);
    const event = new CustomEvent("mind-return-step", { detail: distance, cancelable: true });
    // Lenis accumulates bounded destinations and settles quickly after input stops.
    if (window.dispatchEvent(event)) window.scrollBy({ top: distance, behavior: "smooth" });
    return true;
  };
  const wheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.deltaY === 0 || editable(event.target) || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (automatic && hero.dataset.rewindProgress !== undefined && event.deltaY < 0) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    if (automatic || (returning && event.deltaY > 0)) cancel();
    if (event.deltaY < 0) upwardIntentUntil = performance.now() + 900;
    else upwardIntentUntil = 0;
    if (event.deltaY < 0 && atReturnEdge()) { event.preventDefault(); event.stopImmediatePropagation(); rewindToGalaxy(); return; }
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (step(delta)) { event.preventDefault(); event.stopImmediatePropagation(); }
  };
  const touchStart = (event: TouchEvent) => {
    touchY = event.touches[0]?.clientY ?? 0;
    if (automatic && hero.dataset.rewindProgress === undefined) cancel();
  };
  const touchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    const y = event.touches[0].clientY, delta = touchY - y;
    touchY = y;
    if (editable(event.target)) return;
    if (automatic && hero.dataset.rewindProgress !== undefined && delta < 0) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    if (automatic && delta > 0) cancel();
    if (returning && delta > 0) cancel();
    if (delta < 0) upwardIntentUntil = performance.now() + 900;
    else upwardIntentUntil = 0;
    if (delta < -2 && atReturnEdge()) { event.preventDefault(); event.stopImmediatePropagation(); rewindToGalaxy(); return; }
    if (step(delta)) { event.preventDefault(); event.stopImmediatePropagation(); }
  };
  const key = (event: KeyboardEvent) => {
    if (editable(event.target)) return;
    if (!event.ctrlKey && !event.metaKey && !event.altKey && ["ArrowUp", "PageUp"].includes(event.key)) {
      if (automatic && hero.dataset.rewindProgress !== undefined) { event.preventDefault(); return; }
      upwardIntentUntil = performance.now() + 900;
      if (atReturnEdge()) { event.preventDefault(); if (!automatic) rewindToGalaxy(); return; }
    } else upwardIntentUntil = 0;
    if (event.key === "Home") upwardIntentUntil = 0;
    if (!automatic && !returning) return;
    if (["Escape", "ArrowDown", "PageDown", "Home", "End", " "].includes(event.key)) {
      cancel();
    }
  };
  const navigation = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('.nav-home, .nav-panel')) {
      upwardIntentUntil = 0;
      if (automatic || returning) cancel();
    }
  };
  const preference = () => { if (reduced.matches && (automatic || returning)) cancel(); };
  window.addEventListener("wheel", wheel, { capture: true, passive: false });
  window.addEventListener("touchstart", touchStart, { passive: true });
  window.addEventListener("touchmove", touchMove, { capture: true, passive: false });
  window.addEventListener("keydown", key, true);
  window.addEventListener("scroll", scrolled, { passive: true });
  window.addEventListener("click", navigation, true);
  hero.addEventListener("return-to-surface", start);
  reduced.addEventListener("change", preference);
  return { dispose() {
    disposed = true; finish();
    window.removeEventListener("wheel", wheel, true);
    window.removeEventListener("touchstart", touchStart);
    window.removeEventListener("touchmove", touchMove, true);
    window.removeEventListener("keydown", key, true);
    window.removeEventListener("scroll", scrolled);
    window.removeEventListener("click", navigation, true);
    hero.removeEventListener("return-to-surface", start);
    reduced.removeEventListener("change", preference);
  } };
}
