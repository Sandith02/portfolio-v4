# Search setup

Canonical site: **https://www.sandithdev.com/**. The apex already redirects to www with a permanent 308. Keep that Vercel configuration.

## Positioning

Sandith Sithmaka, design engineer and creative frontend developer based in Sri Lanka. Search and sharing copy describe the work and expertise, with no job-seeking messaging. Project and collaboration inquiries have a dedicated contact page.

| Page | Search purpose | Indexed |
| --- | --- | --- |
| `/` | Name, design engineer, creative frontend developer | Yes |
| `/about` | Personal background and approach | Yes |
| `/work` | Actual projects, frontend engineering, UI/UX and visual identity | Yes |
| `/why` | Creative thinking and portfolio concept | Yes |
| `/contact` | Project and collaboration inquiries | Yes |
| `/blogs` | Threads placeholder | No, until real posts exist |
| `/services`, `/ai-website-redesign` | Legacy pages outside the current portfolio direction | No, pending content review |

The excluded pages remain available and their links can be followed. Do not disallow them in robots.txt, because crawlers need to read their noindex metadata. Vercel preview builds also emit noindex and an empty sitemap.

## Implemented

- Unique titles, descriptions, self-referencing www canonicals, Open Graph and large Twitter/X cards, managed in `lib/seo.ts`.
- Static, route-specific 1200 × 630 galaxy sharing images at `/og/home`, `/og/about`, etc. These use local fonts and build once, without an image service dependency.
- `/sitemap.xml` lists the five finished public pages. No invented modification dates.
- `/robots.txt` permits public pages and rendering assets, excludes `/api/`, and advertises the production sitemap.
- Connected Person, WebSite and page JSON-LD, including a ProfilePage for About. Facts come from the portfolio and CV. No fabricated reviews, business address, articles or search feature.
- Navigation anchors are present in server HTML even when the menu is closed. They remain inert when hidden.
- A readable home and navigation for visitors without JavaScript. Contact offers direct email instead of a nonfunctional form.
- Optional `GOOGLE_SITE_VERIFICATION` metadata, existing vector favicon and Apple icon.

## After production deployment

1. Add `sandithdev.com` as a **Domain property** in [Google Search Console](https://search.google.com/search-console/). Verify using the DNS TXT record Google supplies. This covers both www and apex. Alternatively verify the `https://www.sandithdev.com/` URL-prefix property with its supplied HTML tag token in `GOOGLE_SITE_VERIFICATION` on Vercel, then redeploy. Never invent a verification token.
2. Submit `https://www.sandithdev.com/sitemap.xml` in Search Console. Use URL Inspection on the home, About and Work URLs to check rendered content and request indexing once.
3. Validate `/about` with [Google’s Rich Results Test](https://search.google.com/test/rich-results), and inspect the other schemas with [Schema.org Validator](https://validator.schema.org/). Valid markup does not guarantee a special search appearance.
4. Check a shared URL using [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh any cached older preview. Each route has a distinct image.
5. Monitor indexing, actual search queries, impressions and Core Web Vitals in Search Console. A WebGL-heavy experience needs real mobile performance data; metadata alone does not solve performance or guarantee rankings.

No Search Console property was verified or sitemap submitted automatically. These changes must be deployed before Google can see them.

## Content that will grow visibility

Turn the existing work entries into individual case studies when there is approved content: the problem, actual role, decisions, implementation and evidence of the result. Add original Threads posts with stable URLs and real publication dates. Update the SEO registry and sitemap when those pages are ready. Do not publish thin location pages or invented project results to target keywords.

## Verification

Run `npm run build`, then `npm run start -- --port 3001` in another terminal. Run `npm run test:seo` against that production server. Set `SEO_TEST_URL=https://www.sandithdev.com` to repeat the HTTP checks after deployment. These checks verify server HTML, identity JSON, canonicals, indexing policy, sitemap, robots, image bytes/dimensions and real 404 behavior. Browser checks should also cover menu links, internal Home skipping the splash, and JavaScript-disabled navigation.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page).
