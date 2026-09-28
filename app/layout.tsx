import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import { SiteStructuredData } from "@/components/structured-data";
import "@fontsource-variable/archivo";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/megrim/latin-400.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteInsights } from "@/components/site-insights";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sandith Sithmaka | Design Engineer & Creative Developer",
  applicationName: "Sandith Sithmaka",
  authors: [{ name: "Sandith Sithmaka", url: `${SITE_URL}/about` }],
  creator: "Sandith Sithmaka",
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = { themeColor: "#0b0d0f", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteStructuredData />
        <noscript>
          <style>{`.site-header,.mind-splash{display:none!important}.inner-hero{display:none!important}.no-script-nav{display:flex;flex-wrap:wrap;gap:24px;padding:24px;position:relative;z-index:30;background:#0b0d0f}.no-script-home{max-width:900px;margin:auto;padding:12vh 7vw}.no-script-home h1{font-size:clamp(32px,6vw,72px);line-height:1.1}.no-script-home p{font-size:18px;line-height:1.8;margin:32px 0}.no-script-home a{text-decoration:underline}.constructed-letter-final{opacity:1!important}.constructed-piece{display:none!important}`}</style>
          <nav className="no-script-nav" aria-label="Site navigation">
            <Link href="/">Home</Link><Link href="/work">Work</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/why">Why</Link><Link href="/blogs">Threads</Link>
          </nav>
        </noscript>
        <SmoothScroll />
        <div className="noise" aria-hidden="true" />
        <SiteHeader />
        {children}
        {process.env.VERCEL_ENV === "production" && <><SiteInsights /><GoogleAnalytics /></>}
      </body>
    </html>
  );
}
