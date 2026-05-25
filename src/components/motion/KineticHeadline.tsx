import { motion, useReducedMotion } from "framer-motion";

type Word = { text: string; italic?: boolean };

export function KineticHeadline({
  words,
  className = "",
}: {
  words: Word[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <h1 className={`font-serif leading-[0.95] text-balance ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.05 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-block ${w.italic ? "italic text-foreground/70" : ""}`}
          >
            {w.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}