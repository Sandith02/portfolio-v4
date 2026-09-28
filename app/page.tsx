import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/structured-data";
import { CinematicHero } from "@/components/cinematic-hero";
import { MindSplash } from "@/components/mind-splash";
import Link from "next/link";

export const metadata = pageMetadata("home");

export default function Home() {
  return <><MindSplash /><main id="main-content"><PageStructuredData page="home" /><CinematicHero />
    <noscript>
      <section className="no-script-home">
        <h1>Sandith Sithmaka. Design engineer &amp; creative frontend developer.</h1>
        <p>Quiet outside. Worlds within. I’m Sandith, based in Sri Lanka. I make interactive websites, product interfaces and visual identities, bringing design and frontend engineering together.</p>
        <p><Link href="/work">Explore my work</Link> across corporate platforms, internal tools, brands and campaigns, or <Link href="/about">get to know me</Link>.</p>
        <p><Link href="/why">Read why I create</Link>, follow the thoughts taking shape in <Link href="/blogs">Threads</Link>, or <Link href="/contact#contact-form">start a conversation</Link>.</p>
      </section>
    </noscript></main></>;
}
