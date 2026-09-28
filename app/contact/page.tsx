import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ConstructedTitle } from "@/components/constructed-title";
import { ContactForm } from "@/components/contact-form";
import { WorldSky } from "@/components/world-sky";
import { BackToMind } from "@/components/back-to-mind";
import { CONTACT_EMAIL } from "@/lib/contact";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | Sandith Sithmaka, Design Engineer",
  description: "A project, a collaboration or a thought worth sharing. Get in touch with Sandith Sithmaka, a design engineer and creative frontend developer based in Sri Lanka.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className={worldStyles.world}>
      <WorldSky />
      <BackToMind world="contact" />
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h1 id="contact-title" className={styles.title}>
            <span className="inner-accessible-title">Something in mind?</span>
            <ConstructedTitle lines={["Something", "in mind?"]} />
          </h1>
          <p className={styles.lead}>A project, a possibility, or a thought<br className={styles.desktopBreak} /> you’d like to share. I’m listening.</p>
          <div className={styles.connections}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight size={16} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/sandith02/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn (opens in a new tab)">Connect on LinkedIn<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <p className={styles.place}>Based in Sri Lanka. Open to conversations everywhere.</p>
        </header>
        <section id="contact-form" className={styles.conversation} aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">It starts with a conversation.</h2>
          <p className={styles.formIntro}>You don’t need to have it all figured out.<br />Tell me what you’re thinking.</p>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
