import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

export function MagneticButton({
  children,
  className = "",
  onClick,
  asChild,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 18);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 18);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={`inline-block ${asChild ? "" : "cursor-pointer"} ${className}`}
    >
      {children}
    </motion.div>
  );
}