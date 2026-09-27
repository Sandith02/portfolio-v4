// A scroll-through introduction inside the word-lined tunnel.
export function createMindGateway(hero: HTMLElement) {
  const panel = hero.querySelector<HTMLElement>(".mind-invitation")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smooth = (value: number, from: number, to: number) => {
    const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
    return t * t * (3 - 2 * t);
  };

  return {
    update(progress: number) {
      const opacity = reduced.matches ? 0
        : smooth(progress, 2.15, 2.35) * (1 - smooth(progress, 2.7, 2.95));
      const visible = opacity > .001;
      hero.dataset.gateway = progress < 2.1 ? "before" : visible ? "reading" : "after";
      hero.style.setProperty("--mind-invitation-opacity", opacity.toFixed(3));
      panel.inert = !visible;
      panel.setAttribute("aria-hidden", visible ? "false" : "true");
    },
    dispose() {
      delete hero.dataset.gateway;
      hero.style.removeProperty("--mind-invitation-opacity");
    },
  };
}
