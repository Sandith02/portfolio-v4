import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { Reveal } from "@/components/reveal";
import { LinkArrow } from "@/components/link-arrow";

export const metadata = pageMetadata("services");

const details = [
  ["Custom website development", "Websites built around the brand. Not the template.", "Custom business websites, portfolios and campaign experiences developed with modern web technologies.", ["Next.js development", "React development", "Responsive interfaces", "CMS integration", "API integrations", "Motion and interaction", "SEO foundations", "Deployment"]],
  ["Frontend development", "Make the design survive development.", "Approved designs become responsive, performant interfaces while typography, spacing and interaction stay intact.", ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "REST APIs", "Motion", "CMS platforms"]],
  ["Full-stack development", "The interface is only half the story.", "For products requiring real functionality, I work across frontend and backend development.", ["Authentication", "Dashboards", "Admin systems", "Databases", "REST APIs", "Integrations", "Internal tools", "Custom workflows"]],
  ["AI website redesign", "Your prompt got you here. Let’s take it from here.", "I improve existing generated websites without automatically throwing away the useful parts.", ["Design", "UX", "Responsiveness", "Brand identity", "Code quality", "Performance", "Content hierarchy", "SEO"]],
  ["Creative web development", "For people bored of rectangles.", "Interactive experiences, experimental layouts and campaign pages where interaction makes the experience more memorable.", ["Creative direction", "Scroll stories", "Kinetic type", "Transitions", "Prototypes", "Launch experiences"]]
];

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageStructuredData page="services" />
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Services</p>
          <h1 className="display">I build websites. That’s not the interesting part.</h1>
        </div>
        <div className="page-hero-foot">
          <p className="body-xl">The interesting part is what the website needs to do, how it should feel and what it should avoid.</p>
          <div className="page-hero-actions"><LinkArrow href="/contact">Start something</LinkArrow></div>
        </div>
      </section>

      <section className="section shell content-grid">
        <Reveal className="content-grid-aside">
          <h2 className="display-sm">Development with a point of view.</h2>
          <p className="body-lg muted">Full-stack engineering, frontend craft and digital design thinking in one practice.</p>
        </Reveal>
        <div className="detail-list">
          {details.map(([label, title, copy, items]) => (
            <Reveal className="detail-block" key={label as string}>
              <span className="eyebrow">{label as string}</span>
              <h3>{title as string}</h3>
              <p>{copy as string}</p>
              <div className="capability-grid">
                {(items as string[]).map((item) => <span key={item}>{item}</span>)}
              </div>
              <LinkArrow href="/contact">Discuss the project</LinkArrow>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
