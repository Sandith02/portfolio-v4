import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { LinkArrow } from "@/components/link-arrow";
import { WorkRail } from "@/components/work-rail";
import { services } from "@/lib/data";
import { KineticHero } from "@/components/kinetic-hero";
import { ScrollManifesto } from "@/components/scroll-manifesto";
import { AiRescueScene } from "@/components/ai-rescue-scene";

export default function Home() {
  return (
    <main id="main-content">
      <KineticHero />
      <ScrollManifesto />

      <section className="section-tight shell">
        <div className="work-intro">
          <Reveal>
            <h2 className="display-md">Some things I’ve put on the internet.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg muted">Websites, platforms, internal systems and experiments built for actual people with actual problems.</p>
            <LinkArrow href="/work">Explore all work</LinkArrow>
          </Reveal>
        </div>
      </section>

      <WorkRail />

      <AiRescueScene />

      <section className="section shell">
        <Reveal>
          <h2 className="display-md">Things I can make significantly better.</h2>
        </Reveal>
        <div className="services-list">
          {services.map((service, index) => (
            <Reveal className="service-row" key={service.title}>
              <span className="index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section shell philosophy">
        <Reveal>
          <h2 className="display-md">Great development also gives a damn.</h2>
        </Reveal>
        <Reveal className="philosophy-copy">
          <p className="body-xl">I care whether the button feels right, the mobile version got equal attention and the words actually say something.</p>
          <p className="body-lg muted">Code matters. Design matters. Performance matters. The tiny things matter. That’s usually where the difference lives.</p>
          <div className="philosophy-words">
            <span>Code</span><span>Design</span><span>Motion</span><span>Words</span><span>Details</span>
          </div>
        </Reveal>
      </section>

      <section className="section shell big-cta">
        <Reveal>
          <ArrowDownRight size={48} weight="thin" className="signal" aria-hidden="true" />
          <h2 className="display">Got something half-built?</h2>
        </Reveal>
        <Reveal className="big-cta-bottom">
          <p className="body-xl">A Figma file, an AI-generated site, a startup idea or twelve WhatsApp notes that make perfect sense in your head.</p>
          <LinkArrow href="/contact">Tell me the idea</LinkArrow>
        </Reveal>
      </section>
    </main>
  );
}
