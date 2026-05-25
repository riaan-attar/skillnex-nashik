import { motion, useScroll, useSpring } from "framer-motion";

export function ChapterRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <div className="fixed left-0 top-0 bottom-0 w-px z-40 pointer-events-none hidden md:block">
      <div className="absolute inset-0 bg-foreground/10" />
      <motion.div
        className="absolute top-0 left-0 w-full bg-foreground origin-top"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
}