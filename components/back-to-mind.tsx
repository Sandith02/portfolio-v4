"use client";

import Link from "next/link";
import { ArrowUpLeft } from "@phosphor-icons/react";
import { WORLD_RETURN_EVENT } from "@/lib/world-navigation";
import { skipIntroOnNavigation } from "@/lib/intro-navigation";
import { MindPlanetIcon } from "./mind-planet-icon";
import styles from "./mind-world.module.css";

export function BackToMind({ world }: { world: "about" | "work" | "contact" | "why" | "threads" }) {
  return (
    <Link href={`/#${world}-world`} scroll={false} className={`inner-linkedin ${styles.back}`} onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      skipIntroOnNavigation();
      event.preventDefault();
      window.dispatchEvent(new CustomEvent(WORLD_RETURN_EVENT, { detail: world }));
    }}>
      <span className="inner-linkedin-arrow"><ArrowUpLeft size={14} aria-hidden="true" /></span>
      <span>Back to my mind</span>
      <MindPlanetIcon world={world} />
    </Link>
  );
}
