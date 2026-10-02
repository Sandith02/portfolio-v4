# Sharing image assets

These assets are read at build time by `app/og/[slug]/route.tsx`; they are not part of the browser's page bundle.

- `galaxy.jpg`: JPEG encoding of the portfolio's existing `public/images/galaxy-return.webp`, for the image renderer's supported formats. No new artwork or text is baked into it.
- `manrope-latin-400-normal.woff`: static Manrope Regular from `@fontsource/manrope@5.2.6`, downloaded from jsDelivr. The image renderer needs a static WOFF instead of the website's variable WOFF2. License included in `Manrope-LICENSE.txt`.

Megrim is loaded from the existing installed font package. Metadata and article structured data share the versioned `sharingImageUrl()` helper in `lib/seo.ts`.
