import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ConstructedTitle } from "@/components/constructed-title";
import { BackToMind } from "@/components/back-to-mind";
import { WorldSky } from "@/components/world-sky";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./why.module.css";

export const metadata = pageMetadata("why");

export default function WhyPage() {
  return (
    <main id="main-content" className={worldStyles.world}>
      <PageStructuredData page="why" />
      <WorldSky />
      <BackToMind world="why" />
      <article className={styles.layout} aria-labelledby="why-title">
        <header className={styles.opening}>
          <h1 id="why-title" className={styles.title}>
            <span className="inner-accessible-title">This is where the quiet goes.</span>
            <ConstructedTitle lines={["This is where", "the quiet", "goes."]} />
          </h1>
          <p className={styles.note}>What I couldn’t say, I made.</p>
        </header>
        <div className={styles.story}>
          <p className={styles.lead}>Somewhere between<br />art and code.</p>
          <section className={styles.thought} aria-labelledby="why-form">
            <h2 id="why-form">To give a thought a form.</h2>
            <p>I leave a lot unsaid. Making gives those thoughts somewhere to go. A feeling can become a colour, a small interaction, a page that moves a little differently. Sometimes I only understand the idea once I start building it.</p>
          </section>
          <section className={styles.thought} aria-labelledby="why-follow">
            <h2 id="why-follow">To follow an idea through.</h2>
            <p>I’m drawn to the whole process: imagining how something could look, feel and behave, then working out how to make it real. The visual direction, the experience and the engineering all shape one another.</p>
            <p>I like taking an idea far enough that someone can use it, question it and help make it better. That means paying attention to the details, listening to feedback and being willing to try again.</p>
          </section>
          <section className={styles.thought} aria-labelledby="why-room">
            <h2 id="why-room">To leave room for discovery.</h2>
            <p>This portfolio gives that curiosity a place of its own. The words on the figure, the journey inward, the worlds you can wander through. They’re ways of letting you explore a little of what usually stays inside.</p>
            <p>Some ideas are clear. Others are still taking shape. I want to keep making room for both.</p>
          </section>
          <p className={styles.closing}>Still curious.<br /><span>Still becoming.</span></p>
          <nav className={styles.next} aria-label="Continue exploring">
            <Link href="/work">Explore my work<ArrowUpRight size={17} aria-hidden="true" /></Link>
            <Link href="/contact#contact-form">Start a conversation<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </nav>
        </div>
      </article>
    </main>
  );
}
