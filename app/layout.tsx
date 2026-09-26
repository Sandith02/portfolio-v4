import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/megrim/latin-400.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://sandithdev.com"),
  title: "Sandith Sithmaka — Creative Developer",
  description: "Creative developer based in Sri Lanka. Exploring design, code and expressive web experiences. Open to creative development roles.",
  openGraph: {
    title: "Sandith Dev",
    description: "Quiet outside. Worlds within. The creative development portfolio of Sandith Sithmaka.",
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
