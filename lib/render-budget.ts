import { qualityScale, type RenderQuality } from "./adaptive-quality";

// Touch tablets/landscape phones need the mobile budget too.
export function isMobileRendering() {
  return window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 1366px)").matches;
}

export function mobilePixelRatio(width: number, height: number, maxDpr = 1) {
  // Cap total pixels as well as DPR so large touch screens don't undo the budget.
  return Math.min(window.devicePixelRatio || 1, maxDpr, Math.sqrt(700_000 / Math.max(1, width * height)));
}

export function renderPixelRatio(width: number, height: number, compact: boolean, quality: RenderQuality, mobileMaxDpr = 1) {
  // Extra scene clarity is reserved for high quality. Slower phones retain the
  // original fallback resolutions; background and splash keep their own budget.
  const base = compact ? mobilePixelRatio(width, height, quality === "high" ? mobileMaxDpr : 1) : Math.min(window.devicePixelRatio || 1, 1.5);
  const maxPixels = quality === "low" ? 2_000_000 : quality === "balanced" ? 4_000_000 : Infinity;
  return Math.min(base * qualityScale[quality], Math.sqrt(maxPixels / Math.max(1, width * height)));
}

export function preferLightweightLoading() {
  // These hints are optional. Network speed never classifies the device's GPU.
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return connection?.saveData === true || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
}
