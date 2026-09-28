import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ConstructedTitle } from "@/components/constructed-title";
import { WorldSky } from "@/components/world-sky";
import { BackToMind } from "@/components/back-to-mind";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Work | Sandith Sithmaka, Design Engineer",
  description: "Selected work across corporate platforms, product interfaces, brands and campaigns. Design and frontend engineering by Sandith Sithmaka.",
};

const projects = [
  {
    id: "cogent-solutions",
    name: "Cogent Solutions",
    category: "Corporate platform",
    context: "Cogent Solutions Event Management",
    role: "Frontend engineering · Platform development",
    summary: "A new home for an international B2B events company. I rebuilt the legacy corporate website as a Next.js platform, carrying the creative direction into responsive interfaces and through to launch.",
    contribution: [
      "Built the complete frontend, with reusable interfaces and motion across desktop and mobile.",
      "Implemented Supabase-backed workflows and Next.js Multi-Zones, supporting routing and deployment across the wider web ecosystem.",
      "Integrated GA4, Google Search Console and Vercel Analytics, then iterated using feedback, technical SEO findings and visual QA.",
    ],
    tools: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    href: "https://cogentsolutions.ae",
  },
  {
    id: "supernizo",
    name: "SuperNizo",
    category: "Internal product",
    context: "Cogent Solutions Event Management",
    role: "Product UI/UX · Frontend engineering",
    summary: "An internal platform for lead generation, enrichment and outreach. I designed and built the complete frontend, making complex lead workflows easier to navigate through clear hierarchy and a focused dashboard.",
    contribution: [
      "Designed the product interface and developed the complete Next.js frontend for managing lead data, enrichment and outreach operations.",
      "Supported Make.com automation workflows and deployment in a Hetzner-hosted production environment.",
    ],
    tools: ["Next.js", "Product UI/UX", "Make.com", "Hetzner"],
    note: "Internal platform",
  },
  {
    id: "go-technologies",
    name: "Go Technologies",
    companion: "& Go Chauffeur",
    category: "Brand & digital products",
    context: "Freelance through Tourithm",
    role: "Visual identity · UI/UX · Frontend engineering",
    summary: "From a visual identity to the products that carry it. I developed the brand systems for Go Technologies and Go Chauffeur, and I’m now bringing that direction into their web experiences.",
    contribution: [
      "Created the complete visual identity and brand system for both Go Technologies and Go Chauffeur.",
      "Designing and developing the Go Technologies corporate website with Next.js, TypeScript, Three.js and motion-driven interactions.",
      "Leading UI/UX and frontend development for Go Chauffeur, working through its operational and customer journeys.",
    ],
    tools: ["Brand identity", "Next.js", "TypeScript", "Three.js"],
    note: "Development in progress",
  },
  {
    id: "brand-campaign",
    name: "Beyond the interface",
    category: "Brand, campaign & digital creative",
    context: "Cogent Solutions · Tourithm · IEEE RAS at IIT",
    role: "Creative direction · Campaign design · Event identity",
    summary: "Some ideas become a website. Others become a campaign, a poster or a room full of people wearing the same visual identity. My work also moves across social, print and the spaces around a digital product.",
    contribution: [
      "Develop campaign concepts, content plans and visual direction for B2B events at Cogent and tourism-focused campaigns at Tourithm.",
      "Take primary ownership of Tourithm’s visual content, alongside selected Cogent campaign work, including social creatives, posters and digital assets.",
      "Led and contributed to the design of three IEEE Robotics & Automation Society flagship events at IIT in 2025, spanning logos, campaign graphics, merchandise, attendee tags and event branding.",
    ],
    tools: ["Visual identity", "Campaign concepts", "Social & print", "Event branding"],
  },
];

export default function WorkPage() {
  return (
    <main id="main-content" className={worldStyles.world}>
      <WorldSky />
      <BackToMind world="work" />
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h1 id="work-title" className={styles.title}>
            <span className="inner-accessible-title">Things I made.</span>
            <ConstructedTitle lines={["Things", "I made."]} />
          </h1>
          <p className={styles.lead}>Interfaces, identities and ideas<br className={styles.desktopBreak} /> carried into the real world.</p>
          <nav className={styles.index} aria-label="Selected work">
            {projects.map(project => <a key={project.id} href={`#${project.id}`}>{project.name}<ArrowUpRight size={14} aria-hidden="true" /></a>)}
          </nav>
        </header>

        <div className={styles.projects}>
          {projects.map(project => (
            <article className={styles.project} id={project.id} key={project.id} aria-labelledby={`${project.id}-title`}>
              <div className={styles.projectTop}>
                <p className={styles.category}>{project.category}</p>
                {project.note && <span className={styles.status}>{project.note}</span>}
              </div>
              <h2 id={`${project.id}-title`}>{project.name}{project.companion && <span>{project.companion}</span>}</h2>
              <p className={styles.context}>{project.context}</p>
              <p className={styles.summary}>{project.summary}</p>
              <p className={styles.role}>{project.role}</p>
              <details className={styles.details}>
                <summary>My contribution<span aria-hidden="true" /></summary>
                <ul>{project.contribution.map(item => <li key={item}>{item}</li>)}</ul>
              </details>
              <ul className={styles.tools} aria-label={`Tools and disciplines for ${project.name}`}>{project.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
              {project.href && <a className={styles.visit} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} website (opens in a new tab)`}>Visit website <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </article>
          ))}
          <p className={styles.closing}>Different kinds of work.<br /><span>The same curiosity behind them.</span></p>
        </div>
      </div>
    </main>
  );
}
