# Mobile rendering and analytics

## Mobile budget

`lib/render-budget.ts` selects the lighter path below 768px, or on coarse-pointer touch screens up to 1366px wide (including landscape phones). Desktop keeps its original geometry, DPR, antialiasing and looping typography.

- Main 3D scene: 30fps target, DPR capped at 1 and 700,000 drawing-buffer pixels, no multisample antialiasing.
- Splash sky, inner-page galaxy sky and miniature planet icons render on demand instead of running continuously on mobile. They still use the actual scene and planet materials.
- The hero pauses drawing while the intro covers it. The head and its background stop drawing once the opaque galaxy covers them.
- Work globe: 1,800 simpler particle meshes instead of 6,400 dense meshes. Other globe/ring geometries are reduced only on mobile.
- Thought textures: 1024² instead of 2048² on mobile, with fewer text draws. Both textures together use 75% fewer base-level texture pixels.
- The finale figure downloads after journey progress 18 instead of during startup on mobile. Desktop still prepares it at the beginning.
- Touch devices use native scrolling; the return-to-galaxy controls retain their native scroll fallback.
- Mobile typography uses one layer per letter with a single reveal, replacing continuously looping clipped fragments. Splash reveal avoids animated blur and image scaling.
- Removed WebGL contexts are explicitly released when leaving a scene.

## Local verification

Production build and targeted lint passed. Browser profiling used Chromium, 390 × 844 CSS pixels, DPR 3 and 4× CPU throttling. This is an emulation on a desktop GPU, not a real-device FPS measurement.

Over comparable roughly three-second samples, the Work page changed from 64 WebGL draw calls / 8.29 million submitted triangles to **zero idle draw calls**. The galaxy drawing buffer changed from 487 × 1055 to 390 × 844 pixels. Startup no longer requested the 1.6 MB finale model. The galaxy drew more frames while submitting fewer total triangles in the sample; do not translate this into an FPS guarantee for a phone.

Check the intro, touch planet entry, Back to my mind, late-journey model load, finale, Home, landscape and desktop quality after future scene changes. Real iPhone/Android checks and Speed Insights data are still needed to assess performance across mobile hardware.

## Analytics

All integrations are included only when `VERCEL_ENV=production`, avoiding localhost and preview traffic.

- **Vercel Web Analytics:** `@vercel/analytics/next`, one root instance, automatic route tracking. Query strings and hashes are stripped by `beforeSend`.
- **Vercel Speed Insights:** `@vercel/speed-insights/next`, one root instance. Enable Speed Insights in the Vercel project dashboard if it is not enabled yet. Query strings and hashes are stripped.
- **Google Analytics 4:** measurement ID `G-0DX5RCBC2Q`, matching the provided portfolio web stream. The Google tag uses Next.js `lazyOnload` so it loads after the page load, during idle time. Advertising personalization and Google Signals are disabled. No custom contact-field data is sent.

GA4 uses the stream's existing Enhanced Measurement for initial and History API page views. Keep **Page views → Page changes based on browser history events** enabled. Do not add a second manual page-view sender or duplicate the Google tag in GTM. Google's [SPA guide](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications) describes this behavior.

After deployment, visit the production domain and move between pages. Check Vercel Analytics, Speed Insights and GA4 Realtime / Tag Assistant. Local mocked-script checks verify integration and configuration, not receipt in the analytics dashboards. Blocking extensions may prevent reporting. No deployment or dashboard configuration is performed by these code changes.

References: [Three.js rendering resolution](https://threejs.org/manual/pages/responsive.html), [Next.js script loading](https://nextjs.org/docs/app/guides/scripts).
