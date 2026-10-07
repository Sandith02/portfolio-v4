import { isMobileRendering } from "./render-budget";

// Rendering follows the dynamic viewport; journey distances must stay stable
// when the phone's address bar opens or closes without a change in scrollY.
export function journeyViewportHeight(hero: HTMLElement) {
  const stageHeight = hero.querySelector<HTMLElement>(".cinematic-stage")?.clientHeight ?? window.innerHeight;
  if (!isMobileRendering() || hero.dataset.fallback === "true" || hero.dataset.renderLoading === "true") return Math.max(1, stageHeight);
  const screens = Number.parseFloat(getComputedStyle(hero).getPropertyValue("--journey-screens"));
  if (!Number.isFinite(screens) || screens <= 1 || hero.clientHeight <= stageHeight) return Math.max(1, stageHeight);
  return Math.max(1, hero.clientHeight / screens);
}
