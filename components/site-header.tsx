"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";

const links = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["AI Rescue", "/ai-website-redesign"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`site-header${pathname === "/" ? " site-header-home" : ""}`}>
      <Link className="wordmark" href="/" aria-label="Sandith Dev home">
        SANDITH<span>/DEV</span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <Link className={pathname === href ? "active" : ""} key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <Link className="header-cta" href="/contact">Start something <ArrowUpRight size={16} weight="bold" /></Link>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
        {open ? <X size={24} /> : <List size={24} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile navigation">
              {links.map(([label, href], index) => (
                <motion.div key={href} initial={reduce ? false : { opacity: 0, transform: "translateY(18px)" }} animate={{ opacity: 1, transform: "translateY(0)" }} transition={{ delay: 0.12 + index * 0.05 }}>
                  <Link href={href} onClick={() => setOpen(false)}>{label}</Link>
                </motion.div>
              ))}
            </nav>
            <a className="mobile-email" href="mailto:hello@sandithdev.com">hello@sandithdev.com</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
