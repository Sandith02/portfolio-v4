import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";
import { CinematicHero } from "@/components/cinematic-hero";
import { FilmWork } from "@/components/film-work";
import { RescueWipe } from "@/components/rescue-wipe";
import { Reveal } from "@/components/reveal";
import { LinkArrow } from "@/components/link-arrow";
import { services } from "@/lib/data";

export default function Home() {
  return (
    <main id="main-content">
      <CinematicHero />

      <section className="positioning">
        <div className="positioning-top">
          <p>Full-stack engineering<br />Creative direction<br />Sri Lanka to worldwide</p>
          <h2>Fast is common.<br /><span>Distinct is rare.</span></h2>
        </div>
        <div className="positioning-bottom">
          <p>AI made the first draft easier. The work now is making it clear, useful and impossible to confuse with anyone else.</p>
          <p>I bring strategy, visual judgment, interaction and production code into one process.</p>
        </div>
      </section>

      <FilmWork />

      <section className="manifesto-photo">
        <div className="manifesto-photo-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/events.jpg" alt="A crowded live event beneath dramatic stage lighting" />
        </div>
        <Reveal className="manifesto-photo-copy">
          <p>Good development solves the problem.</p>
          <h2>Great development also gives a damn.</h2>
        </Reveal>
      </section>

      <RescueWipe />

      <section className="service-index">
        <header>
          <p>What I do</p>
          <h2>Useful things,<br />built unusually well.</h2>
        </header>
        <div className="service-index-list">
          {services.map((service, index) => (
            <Reveal className="service-index-row" key={service.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-contact">
        <div className="home-contact-mark"><ArrowDownRight size={64} weight="thin" /></div>
        <div>
          <p>Have a Figma file, a half-built product, an AI-generated site or an idea that needs to exist?</p>
          <h2>Send me the mess.</h2>
          <LinkArrow href="/contact" inverse>Tell me the idea</LinkArrow>
        </div>
      </section>
    </main>
  );
}
