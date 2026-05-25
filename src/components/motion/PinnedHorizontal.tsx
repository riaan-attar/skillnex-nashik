import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function PinnedHorizontal({
  children,
  panelCount,
}: {
  children: ReactNode;
  panelCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((panelCount - 1) / panelCount) * 100}%`]);

  return (
    <section ref={ref} className="relative" style={{ height: `${panelCount * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x, width: `${panelCount * 100}%` }} className="flex h-full">
          {children}
        </motion.div>
      </div>
    </section>
  );
}