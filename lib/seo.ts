import type { Metadata } from "next";
import { AUTHOR_NAME } from "@/lib/identity";
import { type Thread, threadPath } from "@/content/threads";

export const SITE_URL = "https://www.sandithdev.com";
export const PERSON_ID = `${SITE_URL}/#sandith`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const isPreview = process.env.VERCEL_ENV === "preview";

// A new URL lets share crawlers refresh artwork independently of the page URL.
export const sharingImageUrl = (slug: string) => `${SITE_URL}/og/${slug}?v=galaxy-3`;

export const seoPages = {
  home: {
    path: "/", title: `${AUTHOR_NAME} | Design Engineer`,
    description: `The portfolio of ${AUTHOR_NAME}, a design engineer and creative frontend developer in Sri Lanka. Explore his projects, design work and Threads.`,
    headline: "Quiet outside.\nWorlds within.", label: "Design engineer & creative frontend developer", index: true,
  },
  about: {
    path: "/about", title: `About ${AUTHOR_NAME} | Design Engineer`,
    description: `Meet ${AUTHOR_NAME}, a design engineer and creative frontend developer in Sri Lanka. Discover his background, qualifications and creative approach.`,
    headline: "Ideas I want\nto make real.", label: "About Sandith Sithmaka", index: true,
  },
  work: {
    path: "/work", title: `Selected Work | ${AUTHOR_NAME}`,
    description: `Explore ${AUTHOR_NAME}’s work across websites, product UI/UX, frontend engineering and branding, including Cogent Solutions and Tourithm.`,
    headline: "Things\nI made.", label: "Selected work · Design & frontend engineering", index: true,
  },
  contact: {
    path: "/contact", title: `Contact ${AUTHOR_NAME}`,
    description: `Contact ${AUTHOR_NAME} for projects and collaborations in frontend development, UI/UX and brand identity. Based in Sri Lanka.`,
    headline: "Something\nin mind?", label: "Projects & collaborations", index: true,
  },
  why: {
    path: "/why", title: `Why I Create | ${AUTHOR_NAME}`,
    description: `Why ${AUTHOR_NAME} creates: curiosity, making ideas real and finding a form between art and code. The thinking behind his design and development work.`,
    headline: "Where the\nquiet goes.", label: "The thinking behind the work", index: true,
  },
  threads: {
    path: "/blogs", title: `Threads | Design & Code by ${AUTHOR_NAME}`,
    description: `Personal reflections on design, code and the ideas in between by ${AUTHOR_NAME}, a design engineer and creative frontend developer in Sri Lanka.`,
    headline: "Thoughts\ntaking shape.", label: "Threads · By Sandith Sithmaka", index: true,
  },
} as const;

export type SeoPage = keyof typeof seoPages;

export function pageMetadata(key: SeoPage): Metadata {
  const page = seoPages[key];
  const index = page.index && !isPreview;
  const image = { url: sharingImageUrl(key), width: 1200, height: 630, alt: `${page.title}. ${page.headline.replace("\n", " ")}` };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE_URL}${page.path}` },
    robots: { index, follow: true, ...(index ? { googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } } : {}) },
    openGraph: { type: "website", locale: "en_US", siteName: AUTHOR_NAME, url: `${SITE_URL}${page.path}`, title: page.title, description: page.description, images: [image] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [image] },
  };
}

export function threadMetadata(thread: Thread): Metadata {
  const title = `${thread.title} | ${AUTHOR_NAME}`;
  const url = `${SITE_URL}${threadPath(thread)}`;
  const image = { url: sharingImageUrl(thread.slug), width: 1200, height: 630, alt: thread.title };
  return {
    title, description: thread.description,
    authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}/about` }],
    alternates: { canonical: url },
    robots: { index: !isPreview, follow: true, "max-image-preview": "large" },
    openGraph: { type: "article", title, description: thread.description, url, siteName: AUTHOR_NAME, locale: "en_US", publishedTime: thread.published, authors: [`${SITE_URL}/about`], images: [image] },
    twitter: { card: "summary_large_image", title, description: thread.description, images: [image] },
  };
}
