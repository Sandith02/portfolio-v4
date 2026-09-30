import type { Metadata } from "next";
import { SITE_URL, isPreview } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { CookieSettingsButton, CloseCookiePolicy } from "@/components/cookie-settings-button";
import { WorldSky } from "@/components/world-sky";
import worldStyles from "@/components/mind-world.module.css";
import styles from "./cookies.module.css";

export const metadata: Metadata = {
  title: "Cookie Policy | Sandith Sithmaka Thenuwara",
  description: "How this portfolio uses cookies, local storage and optional analytics, and how to change your preferences.",
  alternates: { canonical: `${SITE_URL}/cookies` },
  robots: { index: !isPreview, follow: true },
};

export default function CookiePolicyPage() {
  return <main id="main-content" className={worldStyles.world}>
    <WorldSky />
    <article className={styles.policy}>
      <header className={styles.heading}>
        <h1>Cookie policy</h1>
        <CloseCookiePolicy className={styles.close} />
      </header>
      <p className={styles.updated}>Updated 29 September 2026</p>
      <p>This policy explains how I, Sandith Sithmaka Thenuwara, use cookies and similar browser storage on sandithdev.com.</p>
      <section>
        <h2>Your choice</h2>
        <p>Analytics are on by default when you visit. Choosing Decline turns them off in this browser; choosing Accept keeps them on and dismisses the notice. You can still explore the portfolio, read Threads and send messages or answers with analytics off. Change your choice here or through Cookie settings in the site menu.</p>
        <CookieSettingsButton />
      </section>
      <section>
        <h2>Remembering your preference</h2>
        <p>Your browser stores your accept or reject choice in local storage under <code>sandith-cookie-choice-v1</code>. This record is used only to remember your preference for 180 days. It is not an analytics identifier. Clearing your browser storage removes it; if storage is unavailable, your choice lasts for the current visit.</p>
      </section>
      <section>
        <h2>Google Analytics</h2>
        <p>Unless you decline analytics, Google Analytics helps me understand which pages people visit and how they interact with the site. It can process information such as page addresses, referral sources, device and browser details, approximate location and interactions.</p>
        <p>Google Analytics uses first-party cookies including <code>_ga</code> and <code>_ga_0DX5RCBC2Q</code> to distinguish visits and maintain session information. Google’s default expiration is two years and may refresh with subsequent use. Advertising personalization and Google signals are disabled in this site’s configuration.</p>
        <p>Rejecting analytics stops Google Analytics collection on this browser and removes accessible Google Analytics cookies for this site. It does not delete information already collected. Read more about <a href="https://support.google.com/analytics/answer/11397207" target="_blank" rel="noopener noreferrer">Google Analytics cookies</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.</p>
      </section>
      <section>
        <h2>Vercel analytics and performance</h2>
        <p>This site also uses Vercel Web Analytics to understand visits and Vercel Speed Insights to measure loading performance. These tools are on by default and stop sending events when you decline analytics. Vercel Web Analytics does not use cookies. Query strings and URL fragments are removed from the events sent by these tools.</p>
        <p>See <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s Web Analytics privacy information</a> for details.</p>
      </section>
      <section>
        <h2>Messages, answers and external links</h2>
        <p>Contact messages and answers you choose to send are stored privately in Supabase. They do not require analytics permission. Links to other websites, including project previews and branding documents, are covered by those websites’ own policies.</p>
      </section>
      <section>
        <h2>Questions?</h2>
        <p>You can reach me at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </section>
    </article>
  </main>;
}
