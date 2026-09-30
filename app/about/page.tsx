import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { ConstructedTitle } from "@/components/constructed-title";
import { BackToMind } from "@/components/back-to-mind";
import { WorldSky } from "@/components/world-sky";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./about.module.css";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <main id="main-content" className={worldStyles.world}>
      <PageStructuredData page="about" />
      <WorldSky />
      <BackToMind world="about" />
      <article className={styles.story} aria-labelledby="about-title">
        <header className={styles.opening}>
          <h1 id="about-title" className={styles.title}>
            <span className="inner-accessible-title">I HAVE IDEAS I WANT TO MAKE REAL.</span>
            <ConstructedTitle lines={["I have ideas", "I want to", "make real."]} />
          </h1>
        </header>

        <div className={styles.prose}>
          <p className={styles.introduction}>I’m Sandith Sithmaka Thenuwara, a design engineer and creative frontend developer based in Sri Lanka.</p>
          <p>I’m usually quiet. Making things is how a lot of my thoughts find their way out through an interface, a visual identity, a small interaction or a strange idea that becomes an entire website.</p>
          <p>I’ve worked on corporate platforms, internal tools, brands and campaigns. Across all of them, I’m drawn to the point where an idea starts becoming something you can see, use and feel.</p>
          <p>I like exploring how something could look, move and respond. Trying a direction, questioning it and working through the details until it feels right. Sometimes that means building something unexpected. Sometimes it means knowing what to leave out.</p>
          <p>This portfolio is a personal expression of that curiosity. The words on the body, the journey inside the head, the worlds waiting within. Fragments of how I think, given somewhere to exist.</p>
        </div>

        <div className={styles.background}>
          <section className={styles.detail} aria-labelledby="about-education">
            <h2 id="about-education">Education</h2>
            <h3>BSc (Hons) Computer Science<br />with Industrial Experience</h3>
            <p>University of Westminster, delivered at Informatics Institute of Technology (IIT), Sri Lanka.</p>
            <p className={styles.meta}>September 2023 to expected May 2027 · Part-time</p>
          </section>

          <section className={styles.detail} aria-labelledby="about-recognition">
            <h2 id="about-recognition">Recognition</h2>
            <h3>Employee of the Year 2026</h3>
            <p>Cogent Solutions · Sri Lanka Team</p>
          </section>

          <section className={styles.detail} aria-labelledby="about-community">
            <h2 id="about-community">Community</h2>
            <h3>IEEE Robotics &amp; Automation Society, IIT</h3>
            <ol className={styles.roles} aria-label="Leadership progression">
              <li>Design Volunteer</li>
              <li>Design Vice Chair</li>
              <li>Public Visibility Vice Chair</li>
            </ol>
            <p>Across three flagship events in 2025, I led and contributed to the visual direction, from posters, campaign graphics and logos to merchandise, attendee tags and event branding.</p>
            <p>I helped build a distinctive identity across the event cycle, carrying it from digital promotion into physical assets and the on-site experience.</p>
            <h3 className={styles.additionalTitle}>Additional activities</h3>
            <ul className={styles.activities}>
              <li>IEEE Xtreme 18.0</li>
              <li>CodeSprint 8</li>
              <li>IX25</li>
            </ul>
          </section>
        </div>

        <p className={styles.closing}>There’s a lot I leave unsaid.<br /><span>Some of it ends up here.</span></p>
      </article>
    </main>
  );
}
