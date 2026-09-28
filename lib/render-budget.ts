// Keep desktop fidelity. Touch tablets/landscape phones need the mobile budget too.
export function isMobileRendering() {
  return window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 1366px)").matches;
}

export function mobilePixelRatio(width: number, height: number) {
  // Cap total pixels as well as DPR so large touch screens don't undo the budget.
  return Math.min(window.devicePixelRatio || 1, 1, Math.sqrt(700_000 / Math.max(1, width * height)));
}
