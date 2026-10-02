# Live homepage Lighthouse retest — 2 October 2026

Tested `https://www.sandithdev.com/` after the galaxy-only splash was deployed. Live HTML contains the animated splash caption and no reference to the old splash photograph. Neither splash image was requested in the audit network logs. No application changes were made during this retest.

Lighthouse 13.0.3, headless Chrome on the same Mac, sequential runs. Standard tests use the same desktop preset and default simulated mobile throttling as the [previous audit](./performance-audit-2026-10-01.md). These are local lab measurements, not real-user field data or real-device animation benchmarks.

## Standard runs

| Metric | Desktop 1 | Desktop 2 | Mobile 1 | Mobile 2 |
| --- | ---: | ---: | ---: | ---: |
| Performance | 91 | 89 | 84 | 86 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| First Contentful Paint | 0.54 s | 0.85 s | 1.65 s | 1.22 s |
| Largest Contentful Paint | 0.65 s | 0.85 s | 2.31 s | 1.97 s |
| Total Blocking Time | 128 ms | 126 ms | 366 ms | 248 ms |
| Speed Index | 2.73 s | 3.22 s | 5.72 s | 8.81 s |
| Cumulative Layout Shift | 0.0064 | 0.0060 | 0.0090 | 0.0082 |

Yesterday's performance ranges were desktop 69–99 and mobile 66–90. Today's two runs are closer together, but two samples do not establish general stability. Mobile LCP previously ranged from 3.30 to 8.62 seconds. The new mobile LCP element is the splash caption, rather than the photograph; this metric does not establish when the full 3D scene becomes usable. Mobile Speed Index remains slow and was worse than yesterday's standard runs.

## Full-intro mobile comparison

Actual DevTools throttling, 4× CPU slowdown, 1,474.56 Kbps download, 562.5 ms request latency, and an 8-second post-load observation period. Settings match yesterday's longer diagnostic. Do not average these results with the simulated audits above.

| Metric | 1 October | 2 October |
| --- | ---: | ---: |
| Performance | 61 | 73 |
| First Contentful Paint | 1.86 s | 2.80 s |
| Largest Contentful Paint | 5.97 s | 2.80 s |
| Total Blocking Time | 376 ms | 434 ms |
| Speed Index | 7.06 s | 7.60 s |
| Time to Interactive | 9.90 s | 10.63 s |
| Cumulative Layout Shift | 0.0050 | 0.0082 |
| Total transferred bytes | 1,475,826 | 1,314,956 |

The transfer reduction was 160,870 bytes (about 157 KiB), consistent with removing the mobile photograph. LCP improved while first paint, blocking time and visual completion did not. The measured time to first byte was also slower in this run (1.57 s versus 0.34 s), so changes in individual timings cannot all be attributed to the splash. This was one diagnostic run per version, not a controlled statistical benchmark. The final screenshot showed the rendered hero, not a blank screen.

## Remaining work

- **3D initialization:** the longer mobile run recorded a 387 ms scene-bundle task. Adaptive rendering does not break up this startup work. Profile and move deterministic geometry/texture generation out of startup, or divide initialization into smaller tasks, preserving visual output.
- **Heading animation work:** desktop still reports 420 non-composited animated elements. Pause hidden chapters and reduce animation work that requires the main thread.
- **Unnecessary initial resources:** `galaxy-return.webp` still downloads during the initial page load. It can be scheduled later while ensuring it is ready before the return transition.
- **Small accessibility advisory:** although the weighted accessibility score is 100, one desktop run flagged the LinkedIn link's visible label not matching its accessible name. A perfect score does not mean every advisory passed.

The splash change removes a download and improves measured LCP. It does not prove improved GPU frame rates or fully resolved startup responsiveness. SEO 100 is a checklist result, not a ranking guarantee.

## Saved reports

- [Desktop 1](/private/tmp/sandith-lighthouse-20261002-desktop-1.report.html)
- [Desktop 2](/private/tmp/sandith-lighthouse-20261002-desktop-2.report.html)
- [Mobile 1](/private/tmp/sandith-lighthouse-20261002-mobile-1.report.html)
- [Mobile 2](/private/tmp/sandith-lighthouse-20261002-mobile-2.report.html)
- [Full-intro throttled mobile](/private/tmp/sandith-lighthouse-20261002-mobile-full.report.html)
