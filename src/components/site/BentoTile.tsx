import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "linen" | "ink";
  span?: string; // tailwind col-span / row-span classes
  href?: string;
  hover?: boolean;
};

export function BentoTile({ children, className = "", tone = "linen", span = "", hover = true }: Props) {
  const reduced = useReducedMotion();
  const toneClass =
    tone === "ink"
      ? "ink-section"
      : tone === "paper"
        ? "bg-background border border-foreground/10"
        : "bg-card border border-foreground/5";
  return (
    <motion.div
      whileHover={reduced || !hover ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-sm ${toneClass} ${span} ${className}`}
    >
      {children}
    </motion.div>
  );
}