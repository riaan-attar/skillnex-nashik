import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
};

export function ScrollReveal({ children, delay = 0, y = 24, ...rest }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}