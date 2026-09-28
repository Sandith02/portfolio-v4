"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (["/", "/about", "/work", "/contact", "/why", "/blogs"].includes(pathname)) return null;
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <p>Useful enough to work.<br />Different enough to remember.</p>
        <a href="mailto:hello@sandithdev.com">hello@sandithdev.com</a>
      </div>
      <div className="footer-grid">
        <div>
          <strong>Sandith Dev</strong>
          <span>Full-stack development</span>
          <span>Creative web development</span>
          <span>AI website redesign</span>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/work">Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/ai-website-redesign">AI Rescue</Link>
          <Link href="/about">About</Link>
          <Link href="/blogs">Threads</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-place">
          <strong>Sri Lanka to worldwide</strong>
          <span>Designed, developed and excessively inspected by Sandith.</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sandith Sithmaka</span>
        <span>SANDITHDEV.COM</span>
      </div>
    </footer>
  );
}
