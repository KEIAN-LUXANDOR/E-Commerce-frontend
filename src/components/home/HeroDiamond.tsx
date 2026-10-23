import { FacetDiagram } from "@/components/art/FacetDiagram";
import type { Shape } from "@/lib/types/catalog";

/** Typical face-up measurements of a 1 ct stone in each shape, shown like a report's dimension line. */
const MEASUREMENTS: Partial<Record<Shape, string>> = {
  ROUND: "6.42 – 6.47 × 3.98 mm",
  OVAL: "7.71 × 5.69 × 3.52 mm",
  EMERALD: "7.02 × 5.11 × 3.37 mm",
  CUSHION: "5.95 × 5.89 × 3.91 mm",
  PEAR: "8.48 × 5.62 × 3.40 mm",
  PRINCESS: "5.51 × 5.49 × 3.98 mm",
};

/**
 * The large facet diagram in the hero. Its lines draw themselves once,
 * then the star facets pick up a little spectral "fire". Reduced-motion users see it complete.
 */
export function HeroDiamond({ shape }: { shape: Shape }) {
  const tall = shape === "OVAL" || shape === "PEAR" || shape === "EMERALD" || shape === "MARQUISE";
  const r = 200;
  return (
    <figure className="relative mx-auto w-full max-w-[34rem]">
      <svg key={shape} viewBox="0 0 520 520" className="facet-draw h-auto w-full text-ink" role="img" aria-label={`Facet diagram of a ${shape.toLowerCase()} diamond`}>
        <defs>
          <linearGradient id="fire" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7fd3f2" stopOpacity="0.75" />
            <stop offset="0.35" stopColor="#b3a8f4" stopOpacity="0.65" />
            <stop offset="0.65" stopColor="#f2a9c9" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffd88f" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Dimension line, as on a grading report */}
        <g className="text-slate" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke">
          <line x1={60} y1={500} x2={460} y2={500} pathLength={1} />
          <line x1={60} y1={492} x2={60} y2={508} pathLength={1} />
          <line x1={460} y1={492} x2={460} y2={508} pathLength={1} />
        </g>
        <FacetDiagram shape={shape} cx={260} cy={tall ? 252 : 260} r={r} strokeWidth={1.15} fireId="fire" />
      </svg>
      {MEASUREMENTS[shape] && (
        <figcaption className="mt-1 text-center text-xs tabular-nums text-slate">1.00 ct, {MEASUREMENTS[shape]}</figcaption>
      )}
    </figure>
  );
}
