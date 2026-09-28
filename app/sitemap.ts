import type { MetadataRoute } from "next";
import { SITE_URL, seoPages, isPreview } from "@/lib/seo";
import { threads, threadPath } from "@/content/threads";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  // Omit lastModified until there is a real content modification date to publish.
  return [
    ...Object.values(seoPages).filter(page => page.index).map(page => ({ url: `${SITE_URL}${page.path}` })),
    ...threads.map(thread => ({ url: `${SITE_URL}${threadPath(thread)}` })),
  ];
}
