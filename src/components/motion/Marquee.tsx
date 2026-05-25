import { type ReactNode } from "react";

export function Marquee({
  items,
  className = "",
  separator = "·",
}: {
  items: ReactNode[];
  className?: string;
  separator?: string;
}) {
  const loop = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {loop.map((it, i) => (
          <span key={i} className="flex items-center gap-12">
            {it}
            <span aria-hidden className="text-foreground/30">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}