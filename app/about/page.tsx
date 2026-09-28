import type { Metadata } from "next";
import Link from "next/link";
import { Planet, ArrowUpLeft } from "@phosphor-icons/react/dist/ssr";
import { ConstructedTitle } from "@/components/constructed-title";
import { AboutSky } from "@/components/about-sky";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Sandith | Design Engineer & Creative Frontend Developer",
  description: "I have ideas I want to make real. I’m Sandith, a design engineer and creative frontend developer based in Sri Lanka.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className={styles.world}>
      <AboutSky />
      <Link href="/#about-world" scroll={false} className={`inner-linkedin ${styles.back}`}>
        <span className="inner-linkedin-arrow"><ArrowUpLeft size={14} aria-hidden="true" /></span>
        <span>Back to my mind</span>
        <Planet size={20} weight="light" aria-hidden="true" />
      </Link>
      <article className={styles.story} aria-labelledby="about-title">
        <header className={styles.opening}>
          <h1 id="about-title" className={styles.title}>
            <span className="inner-accessible-title">I HAVE IDEAS I WANT TO MAKE REAL.</span>
            <ConstructedTitle lines={["I have ideas", "I want to", "make real."]} />
          </h1>
        </header>

        <div className={styles.prose}>
          <p className={styles.introduction}>I’m Sandith, a design engineer and creative frontend developer based in Sri Lanka.</p>
          <p>I’m usually quiet. Making things is how a lot of my thoughts find their way out through an interface, a visual identity, a small interaction or a strange idea that becomes an entire website.</p>
          <p>I’ve worked on corporate platforms, internal tools, brands and campaigns. Across all of them, I’m drawn to the point where an idea starts becoming something you can see, use and feel.</p>
          <p>I like exploring how something could look, move and respond. Trying a direction, questioning it and working through the details until it feels right. Sometimes that means building something unexpected. Sometimes it means knowing what to leave out.</p>
          <p>This portfolio is a personal expression of that curiosity. The words on the body, the journey inside the head, the worlds waiting within. Fragments of how I think, given somewhere to exist.</p>
        </div>

        <p className={styles.closing}>There’s a lot I leave unsaid.<br /><span>Some of it ends up here.</span></p>
      </article>
    </main>
  );
}
