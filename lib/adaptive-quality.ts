export type RenderQuality = "high" | "balanced" | "low";

export const qualityScale: Record<RenderQuality, number> = { high: 1, balanced: .85, low: .67 };

// Sample sustained frame delivery, not the GPU name or a single loading hitch.
// The initial balanced setting can earn full quality; failed upgrades are bounded.
export function createAdaptiveQuality(compact: boolean) {
  let quality: RenderQuality = compact ? "high" : "balanced";
  let previous = 0, started = 0, frames = 0, total = 0, slow = 0;
  let goodWindows = 0, badWindows = 0, upgrades = 0, warmupUntil = 0;
  const target = 1000 / (compact ? 30 : 60);
  function reset(now: number) {
    previous = 0; started = now; frames = 0; total = 0; slow = 0;
    goodWindows = 0; badWindows = 0; warmupUntil = now + 1200;
  }
  return {
    get quality() { return quality; },
    reset,
    sample(now: number): RenderQuality | null {
      if (!previous) { previous = now; started = now; warmupUntil = now + 1200; return null; }
      const delta = now - previous;
      previous = now;
      // Ignore tab suspension and debugger pauses, not ordinary slow frames.
      if (delta <= 0 || delta > 1000) { reset(now); return null; }
      if (now < warmupUntil) { started = now; return null; }
      frames++; total += delta;
      if (delta > target * 1.5) slow++;
      if (now - started < 1500 || frames < 10) return null;
      const average = total / frames;
      const struggling = average > target * 1.4 || slow / frames > .3;
      const comfortable = average < target * 1.1 && slow / frames < .05;
      badWindows = struggling ? badWindows + 1 : 0;
      goodWindows = comfortable ? goodWindows + 1 : 0;
      frames = 0; total = 0; slow = 0; started = now;
      let next = quality;
      if (badWindows >= 2) next = quality === "high" ? "balanced" : "low";
      else if (goodWindows >= 4 && upgrades < 2 && quality !== "high") {
        next = quality === "low" ? "balanced" : "high";
        upgrades++;
      }
      if (next === quality) return null;
      quality = next;
      reset(now);
      return quality;
    },
  };
}
