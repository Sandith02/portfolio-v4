# Live homepage performance audit — 1 October 2026

Audited `https://www.sandithdev.com/` using Lighthouse 13.0.3 and headless Chrome 154 on this Mac. Runs were sequential to avoid competing audit processes. These are local lab results, not PageSpeed Insights field data, real-phone benchmarks, or measurements of planet navigation FPS. No application code or deployment was changed during this audit.

The live JavaScript contains `createAdaptiveQuality` and the SSR hero contains `data-render-loading`, confirming that the recent adaptive rendering implementation is present.

## Standard Lighthouse runs

Default simulated throttling; desktop preset for desktop, default mobile configuration for mobile. Both runs are reported because variation is substantial. Neither a best score nor a two-run average establishes typical visitor performance.

| Metric | Desktop run 1 | Desktop run 2 | Mobile run 1 | Mobile run 2 |
| --- | ---: | ---: | ---: | ---: |
| Performance | 69 | 99 | 66 | 90 |
| Accessibility | 95 | 95 | 95 | 95 |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| First Contentful Paint | 0.35 s | 0.27 s | 0.92 s | 0.94 s |
| Largest Contentful Paint | 0.52 s | 0.57 s | 8.62 s | 3.30 s |
| Total Blocking Time | 966 ms | 22 ms | 330 ms | 108 ms |
| Speed Index | 1.78 s | 1.25 s | 3.57 s | 3.48 s |
| Cumulative Layout Shift | 0.0042 | 0.0041 | 0.0057 | 0.0058 |

Desktop Lighthouse selected a single constructed heading letter as its LCP element. Mobile selected the intro photograph. Standard traces ended before the intro finished, so a low desktop LCP does not establish that the galaxy was ready or navigation was usable.

## Longer diagnostic runs

- Desktop, simulated throttling, 8-second post-load observation: performance 93, LCP 0.43 s, TBT 18 ms. The completed hero was visible in the final screenshot. Accessibility was 100 after the splash disappeared; that does not invalidate the splash accessibility failure in the standard runs.
- Mobile, **actual DevTools network/CPU throttling**, 8-second post-load observation: performance **61**, FCP **1.86 s**, LCP **5.97 s**, TBT **376 ms**, Speed Index **7.06 s**, CLS **0.0050**. This configuration differs from the standard simulated audits and must not be averaged with them. The final screenshot showed the rendered hero.

The throttled mobile LCP resource was `mind-splash-glass-mobile.webp`: approximately 158 KB transferred, requested at 0.85 s and completed at 5.95 s. LCP breakdown: 340 ms server response, 513 ms request delay, 5,102 ms download, 17 ms render delay. This run points primarily to resource delivery, rather than a six-second image render delay.

## Recommended work, in priority order

1. **Reduce competition for the first visible image.** Supply correctly sized mobile intro image variants (Lighthouse estimated roughly 65 KB savings). Defer the 83 KB galaxy-return image until after initial loading or before return navigation; it currently downloads even while its overlay is hidden. Preserve a ready transition before revealing it. Review analytics and route-prefetch timing without dropping page views or changing consent behavior. These are scheduling/asset changes, not reductions to planet geometry.
2. **Move repeatable scene preparation out of visitor startup.** The initial desktop run attributed a 1,162 ms task to the scene bundle; the throttled mobile run attributed a 370 ms task to it. `lib/inner-world-scene.ts` repairs and deforms the head, recalculates normals, generates text textures and constructs planets during initialization. `lib/thought-texture.ts` draws a dense 10,240-word base layer on desktop. Bake deterministic geometry/textures where practical, or yield between initialization stages. Profile individual stages before assigning exact costs: the audit identifies the bundle, not the time spent in each function. Compare asset sizes and visuals so saved CPU work does not become excessive network cost.
3. **Stop hidden heading animations and reduce their main-thread work.** The extended desktop audit flagged 420 animated elements, including `letter-pieces` animating `visibility`; style/layout consumed about 1.25 seconds across the longer trace. Pause inactive chapters and titles behind the splash, then check whether the same visible effect can use compositor-friendly properties. Keep the existing fonts and visual construction effect.
4. **Revisit the fixed intro separately.** `components/mind-splash.tsx` holds the splash for over 5,200 ms and then fades for 850 ms. Navigation stays inert until cleanup. A shorter, skippable intro could reduce forced waiting even when resources are ready. This is an experience decision, not merely a Lighthouse fix, and it would not by itself solve the observed mobile image-download delay.
5. **Fix small confirmed issues.** The intro name uses `aria-label` on a plain paragraph, causing the accessibility failure; use appropriate semantics and accessible text. The LinkedIn image is 635×540 but displayed around 20×17, wasting roughly 8 KB. Review the four initial font families and preload only genuinely critical fonts rather than all assets.

Adaptive resolution helps ongoing rendering; it cannot remove synchronous initialization work or download delays. These proposed changes should be tested individually with repeatable production builds, full-intro recordings, planet entry/return checks and visual comparisons. SEO 100 is an automated checklist result, not a guarantee of search rankings.

## Reports

The full reports are local audit artifacts:

- [Desktop run 1](/private/tmp/sandith-lighthouse-desktop.report.html)
- [Desktop run 2](/private/tmp/sandith-lighthouse-desktop-repeat.report.html)
- [Mobile run 1](/private/tmp/sandith-lighthouse-mobile.report.html)
- [Mobile run 2](/private/tmp/sandith-lighthouse-mobile-repeat.report.html)
- [Extended desktop](/private/tmp/sandith-lighthouse-desktop-full.report.html)
- [Throttled full-intro mobile](/private/tmp/sandith-lighthouse-mobile-full.report.html)

References: [Google's LCP optimization guidance](https://web.dev/articles/optimize-lcp), [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [optimizing long tasks](https://web.dev/articles/optimize-long-tasks).
