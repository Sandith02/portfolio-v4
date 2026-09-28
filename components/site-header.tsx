"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, HouseSimple, X } from "@phosphor-icons/react";
import { skipIntroOnNavigation } from "@/lib/intro-navigation";

const links = [["Work", "/work"], ["About", "/about"], ["Contact", "/contact"], ["Why", "/why"], ["Threads", "/blogs"]];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = pathname === "/" ? document.querySelector<HTMLElement>(".inner-hero") : null;
      const range = hero ? hero.offsetHeight - (hero.querySelector<HTMLElement>(".cinematic-stage")?.clientHeight ?? window.innerHeight) : document.documentElement.scrollHeight - window.innerHeight;
      const percent = range > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / range)) * 100) : 0;
      if (progress.current) {
        progress.current.textContent = `${percent}%`;
        progress.current.dataset.infinite = "false";
        progress.current.title = hero ? "Journey through my inner world" : "Page scroll progress";
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  return (
    <header className="site-header" ref={root}>
      <div className="nav-capsule">
        <button ref={toggle} className="nav-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={20} weight="light" /> : <span className="nav-menu-icon" aria-hidden="true"><i /><i /></span>}<span>{open ? "Close" : "Menu"}</span>
        </button>
        <Link className="nav-home" href="/" aria-label="Home" title="Home" onClick={event => {
          setOpen(false);
          if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) skipIntroOnNavigation();
          if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
        }}><HouseSimple size={16} weight="light" /></Link>
        <span className="nav-progress" ref={progress} title="Page scroll progress" aria-hidden="true">0%</span>
      </div>
      <motion.div id="site-menu" className="nav-panel" initial={false} inert={!open} aria-hidden={!open} animate={{ opacity: open ? 1 : 0, y: open ? 0 : -6, visibility: open ? "visible" : "hidden" }} transition={{ duration: reduce ? 0 : .18 }}>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={15} weight="light" /></Link>)}
        </nav>
        <a className="nav-contact" href="mailto:hello@sandithdev.com?subject=Creative%20developer%20role" onClick={() => setOpen(false)}><span data-nosnippet>Let’s talk roles</span> <ArrowUpRight size={14} /></a>
      </motion.div>
    </header>
  );
}
