import { AUTHOR_NAME, AUTHOR_ALIASES } from "@/lib/identity";
import { PERSON_ID, WEBSITE_ID, SITE_URL, seoPages, sharingImageUrl, type SeoPage } from "@/lib/seo";
import { type Thread, threadPath } from "@/content/threads";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function SiteStructuredData() {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME,
        alternateName: AUTHOR_ALIASES, url: `${SITE_URL}/about`,
        jobTitle: "Design Engineer and Creative Frontend Developer",
        homeLocation: { "@type": "Country", name: "Sri Lanka" },
        sameAs: ["https://www.linkedin.com/in/sandith02/", "https://github.com/Sandith02"],
        knowsAbout: ["Frontend development", "Design engineering", "UI/UX design", "Next.js", "React", "TypeScript", "Three.js", "Visual identity"],
      },
      {
        "@type": "WebSite", "@id": WEBSITE_ID, url: `${SITE_URL}/`, name: AUTHOR_NAME,
        alternateName: AUTHOR_ALIASES, description: seoPages.home.description, inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
    ],
  }} />;
}

export function PageStructuredData({ page: key }: { page: SeoPage }) {
  const page = seoPages[key];
  const url = `${SITE_URL}${page.path}`;
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": key === "about" ? "ProfilePage" : key === "contact" ? "ContactPage" : key === "work" || key === "threads" ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`, url, name: page.title, description: page.description,
    inLanguage: "en", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID }, ...(key === "about" ? { mainEntity: { "@id": PERSON_ID } } : {}),
    ...(key !== "home" ? { breadcrumb: {
      "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: key === "threads" ? "Threads" : key.charAt(0).toUpperCase() + key.slice(1), item: url },
      ],
    } } : {}),
  }} />;
}

export function ThreadStructuredData({ thread }: { thread: Thread }) {
  const url = `${SITE_URL}${threadPath(thread)}`;
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting", "@id": `${url}#article`, url,
        headline: thread.title, description: thread.description, inLanguage: "en",
        datePublished: thread.published,
        author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME, url: `${SITE_URL}/about` },
        publisher: { "@id": PERSON_ID },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": WEBSITE_ID },
        image: [sharingImageUrl(thread.slug)],
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Threads", item: `${SITE_URL}/blogs` },
          { "@type": "ListItem", position: 3, name: thread.title, item: url },
        ],
      },
    ],
  }} />;
}
