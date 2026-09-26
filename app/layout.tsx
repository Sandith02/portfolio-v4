import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://sandithdev.com"),
  title: "Sandith - Full-Stack & Freelance Web Developer in Sri Lanka",
  description: "Sandith is a full-stack and freelance web developer in Sri Lanka specialising in Next.js, React, creative web experiences and AI website redesign.",
  openGraph: {
    title: "Sandith Dev",
    description: "AI made it fast. I make it good.",
    type: "website",
    url: "https://sandithdev.com"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SmoothScroll />
        <div className="noise" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
