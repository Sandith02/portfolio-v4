"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "@phosphor-icons/react";
import { cookieChoice, serverCookieChoice, subscribeCookieChoice, saveCookieChoice, SETTINGS_EVENT, type CookieChoice } from "@/lib/cookie-consent";
import { GoogleAnalytics } from "./google-analytics";
import { SiteInsights } from "./site-insights";
import styles from "./cookie-controls.module.css";

export function CookieControls({ production }: { production: boolean }) {
  const choice = useSyncExternalStore<CookieChoice | "pending">(subscribeCookieChoice, cookieChoice, serverCookieChoice);
  const [opened, setOpened] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const open = () => { trigger.current = document.activeElement as HTMLElement; setOpened(true); requestAnimationFrame(() => panel.current?.focus()); };
    window.addEventListener(SETTINGS_EVENT, open);
    return () => window.removeEventListener(SETTINGS_EVENT, open);
  }, []);
  function close() {
    setOpened(false);
    const target = trigger.current?.closest("[inert]") ? document.querySelector<HTMLButtonElement>(".nav-toggle") : trigger.current;
    target?.focus();
  }
  function choose(value: "accepted" | "rejected") { saveCookieChoice(value); close(); }
  const visible = opened || choice === "unknown";
  const enabled = choice !== "pending" && choice !== "rejected";
  return <>
    {production && <GoogleAnalytics enabled={enabled} />}
    {production && enabled && <SiteInsights />}
    {visible && <section ref={panel} tabIndex={-1} className={styles.panel} aria-label="Cookie preferences" data-lenis-prevent>
      <div className={styles.copy}>
        <p><span className={styles.description}>Analytics help improve this site. Decline to turn them off. </span><Link href="/cookies" className={styles.policy}>Cookie policy</Link></p>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose("rejected")} aria-label="Decline analytics">Decline</button>
        <button type="button" className={styles.accept} onClick={() => choose("accepted")} aria-label="Accept analytics">Accept</button>
      </div>
      {choice !== "unknown" && <button type="button" className={styles.close} onClick={close} aria-label="Close cookie settings"><X size={18} aria-hidden="true" /></button>}
    </section>}
  </>;
}
