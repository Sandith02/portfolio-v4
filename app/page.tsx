import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { CinematicHero } from "@/components/cinematic-hero";
import { MindSplash } from "@/components/mind-splash";

export const metadata = pageMetadata("home");

export default function Home() {
  return <><MindSplash /><main id="main-content"><PageStructuredData page="home" /><CinematicHero />
    <noscript>
      <section className="no-script-home">
        <h1>Sandith Sithmaka. Design engineer &amp; creative frontend developer.</h1>
        <p>Quiet outside. Worlds within. I’m Sandith, based in Sri Lanka. I make interactive websites, product interfaces and visual identities, bringing design and frontend engineering together.</p>
        <p><a href="/work">Explore my work</a> across corporate platforms, internal tools, brands and campaigns, or <a href="/about">get to know me</a>.</p>
        <p><a href="/why">Read why I create</a>, follow the thoughts taking shape in <a href="/blogs">Threads</a>, or <a href="/contact#contact-form">start a conversation</a>.</p>
      </section>
    </noscript></main></>;
}
