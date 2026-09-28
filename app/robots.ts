import type { MetadataRoute } from "next";
import { SITE_URL, isPreview } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    // Previews carry noindex metadata. Crawlers must be allowed to read it.
    ...(isPreview ? {} : { sitemap: `${SITE_URL}/sitemap.xml` }),
  };
}
