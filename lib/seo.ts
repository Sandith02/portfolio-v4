import type { Metadata } from "next";

export const SITE_URL = "https://www.sandithdev.com";
export const PERSON_ID = `${SITE_URL}/#sandith`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const isPreview = process.env.VERCEL_ENV === "preview";

export const seoPages = {
  home: {
    path: "/", title: "Sandith Sithmaka | Design Engineer & Creative Developer",
    description: "Sandith Sithmaka is a design engineer and creative frontend developer in Sri Lanka. Explore his work across interactive websites, product interfaces and brands.",
    headline: "Quiet outside.\nWorlds within.", label: "Design engineer & creative frontend developer", index: true,
  },
  about: {
    path: "/about", title: "About Sandith Sithmaka | Design Engineer in Sri Lanka",
    description: "Meet Sandith Sithmaka, a design engineer and creative frontend developer based in Sri Lanka, turning ideas into interfaces, visual identities and web experiences.",
    headline: "Ideas I want\nto make real.", label: "About Sandith Sithmaka", index: true,
  },
  work: {
    path: "/work", title: "Selected Work | Sandith Sithmaka, Design Engineer",
    description: "Explore Sandith Sithmaka’s work for Cogent Solutions, SuperNizo and Go Technologies, spanning Next.js platforms, product UI/UX, frontend engineering and branding.",
    headline: "Things\nI made.", label: "Selected work · Design & frontend engineering", index: true,
  },
  contact: {
    path: "/contact", title: "Contact Sandith Sithmaka | Projects & Collaborations",
    description: "Have a project or collaboration in mind? Contact Sandith Sithmaka, a design engineer and creative frontend developer in Sri Lanka. Let’s start a conversation.",
    headline: "Something\nin mind?", label: "Projects & collaborations", index: true,
  },
  why: {
    path: "/why", title: "Why I Create | Sandith Sithmaka",
    description: "Why Sandith Sithmaka creates: curiosity, making ideas real and finding a form between art and code. The thinking behind his design and frontend development work.",
    headline: "Where the\nquiet goes.", label: "The thinking behind the work", index: true,
  },
  threads: {
    path: "/blogs", title: "Threads | Thoughts on Design & Code by Sandith Sithmaka",
    description: "Thoughts on design, code and the ideas in between. Notes and experiments by Sandith Sithmaka. The first threads are coming soon.",
    headline: "Thoughts\ntaking shape.", label: "Threads · Coming soon", index: false,
  },
} as const;

export type SeoPage = keyof typeof seoPages;

export function pageMetadata(key: SeoPage): Metadata {
  const page = seoPages[key];
  const index = page.index && !isPreview;
  const image = { url: `${SITE_URL}/og/${key}`, width: 1200, height: 630, alt: `${page.title}. ${page.headline.replace("\n", " ")}` };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE_URL}${page.path}` },
    robots: { index, follow: true, ...(index ? { googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } } : {}) },
    openGraph: { type: "website", locale: "en_US", siteName: "Sandith Sithmaka", url: `${SITE_URL}${page.path}`, title: page.title, description: page.description, images: [image] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [image] },
  };
}
