import type { MetadataRoute } from "next";
import { SITE_URL, seoPages, isPreview } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  // Omit lastModified until there is a real content modification date to publish.
  return Object.values(seoPages).filter(page => page.index).map(page => ({ url: `${SITE_URL}${page.path}` }));
}
