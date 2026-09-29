"use client";

import { openCookieSettings } from "@/lib/cookie-consent";
import { skipIntroOnNavigation } from "@/lib/intro-navigation";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
export function CookieSettingsButton() {
  return <button type="button" onClick={openCookieSettings}>Change cookie settings</button>;
}

export function CloseCookiePolicy({ className }: { className?: string }) {
  return <Link href="/" className={className} aria-label="Close cookie policy and return home" title="Back to home" onClick={event => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) skipIntroOnNavigation();
  }}><X size={20} aria-hidden="true" /></Link>;
}
