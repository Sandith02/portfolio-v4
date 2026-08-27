import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Hire a Freelance Web Developer | Sandith Dev",
  description: "Looking for a freelance web developer for your website, frontend, web application or AI-generated website redesign? Work with Sandith Dev."
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Contact</p>
          <h1 className="display">Let’s make something.</h1>
        </div>
        <div className="page-hero-foot">
          <p className="body-xl">A website, a frontend, a generated site that needs rescuing or something too weird for a category. Send it.</p>
        </div>
      </section>

      <section className="section shell contact-layout">
        <Reveal className="contact-copy">
          <h2 className="display-sm">Start the conversation.</h2>
          <a href="mailto:hello@sandithdev.com">hello@sandithdev.com</a>
          <div className="contact-meta">
            <div><strong>Based in</strong><span>Sri Lanka</span></div>
            <div><strong>Working with</strong><span>People everywhere the internet works.</span></div>
            <div><strong>Good to send</strong><span>A brief, a link, a Figma file or a very long voice note.</span></div>
          </div>
        </Reveal>
        <Reveal delay={0.08}><ContactForm /></Reveal>
      </section>
    </main>
  );
}
