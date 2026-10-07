import { isMobileRendering } from "./render-budget";

// Rendering follows the dynamic viewport; journey distances must stay stable
// when the phone's address bar opens or closes without a change in scrollY.
export function journeyViewportHeight(hero: HTMLElement) {
  const stageHeight = hero.querySelector<HTMLElement>(".cinematic-stage")?.clientHeight ?? window.innerHeight;
  if (!isMobileRendering() || hero.dataset.fallback === "true" || hero.dataset.renderLoading === "true") return Math.max(1, stageHeight);
  const style = getComputedStyle(hero);
  const screens = Number.parseFloat(style.getPropertyValue("--journey-screens"));
  if (!Number.isFinite(screens) || screens <= 1 || hero.clientHeight <= stageHeight) return Math.max(1, stageHeight);
  const configuredScale = Number.parseFloat(style.getPropertyValue("--journey-scroll-scale"));
  const scale = Number.isFinite(configuredScale) && configuredScale > 0 ? configuredScale : 1;
  // Keep one full viewport for the sticky stage; shorten only the scrollable
  // distance. Every scene stop and return link shares this same logical unit.
  const physicalScreens = 1 + (screens - 1) * scale;
  return Math.max(1, hero.clientHeight / physicalScreens * scale);
}
