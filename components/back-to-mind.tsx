import Link from "next/link";
import { ArrowUpLeft } from "@phosphor-icons/react/dist/ssr";
import { MindPlanetIcon } from "./mind-planet-icon";
import styles from "./mind-world.module.css";

export function BackToMind({ world }: { world: "about" | "work" | "contact" | "why" }) {
  return (
    <Link href={`/#${world}-world`} scroll={false} className={`inner-linkedin ${styles.back}`}>
      <span className="inner-linkedin-arrow"><ArrowUpLeft size={14} aria-hidden="true" /></span>
      <span>Back to my mind</span>
      <MindPlanetIcon world={world} />
    </Link>
  );
}
