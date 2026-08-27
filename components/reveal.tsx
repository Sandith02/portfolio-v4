"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, transform: "translateY(58px) rotate(1.5deg)", clipPath: "inset(0 0 20% 0)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)", clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HeroReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, transform: "translateY(42px)", clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, transform: "translateY(0px)", clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
