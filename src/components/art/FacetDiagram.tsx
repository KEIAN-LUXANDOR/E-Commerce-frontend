import { facetGeometry, toPoints } from "@/components/art/facets";
import type { Shape } from "@/lib/types/catalog";

interface Props {
  shape: Shape;
  /** Centre and radius in the parent SVG's units */
  cx: number;
  cy: number;
  r: number;
  /** Line thickness in px on screen */
  strokeWidth?: number;
  /** Show only outline + table (for small icons) */
  simple?: boolean;
  /** Fill star facets with the spectral gradient id given */
  fireId?: string;
  /** Squash vertically, e.g. 0.6 for a 3/4 view */
  squash?: number;
  className?: string;
}

/** A diamond drawn as a grading-report facet diagram. Renders inside an existing <svg>. */
export function FacetDiagram({ shape, cx, cy, r, strokeWidth = 1, simple, fireId, squash = 1, className }: Props) {
  const g = facetGeometry(shape);
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    vectorEffect: "non-scaling-stroke" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
  };
  return (
    <g className={className} transform={squash !== 1 ? `translate(0 ${cy * (1 - squash)}) scale(1 ${squash})` : undefined}>
      <polygon points={toPoints(g.outline, cx, cy, r)} {...common} fill="#fff" fillOpacity={0.55} />
      {fireId &&
        g.stars.map((s, i) => (
          <polygon
            key={`f${i}`}
            points={toPoints(s, cx, cy, r)}
            fill={`url(#${fireId})`}
            stroke="none"
            data-fire=""
            style={{ animationDelay: `${1.9 + (i % 4) * 0.12}s` }}
          />
        ))}
      {g.polygons.slice(0, simple ? 1 : undefined).map((p, i) => (
        <polygon key={`p${i}`} points={toPoints(p, cx, cy, r)} {...common} />
      ))}
      {!simple &&
        g.lines.map(([a, b], i) => (
          <line
            key={`l${i}`}
            x1={cx + a[0] * r}
            y1={cy + a[1] * r}
            x2={cx + b[0] * r}
            y2={cy + b[1] * r}
            {...common}
            strokeWidth={strokeWidth * 0.8}
          />
        ))}
    </g>
  );
}

/** Side view of a diamond: crown on top, pavilion below, as drawn on a report's proportions diagram. */
export function DiamondProfile({
  cx,
  cy,
  w,
  strokeWidth = 1,
  step,
}: {
  cx: number;
  cy: number;
  w: number;
  strokeWidth?: number;
  step?: boolean;
}) {
  const half = w / 2;
  const table = w * (step ? 0.62 : 0.56);
  const crown = w * (step ? 0.1 : 0.16);
  const girdle = w * 0.025;
  const pavilion = w * (step ? 0.38 : 0.43);
  const top = cy - crown;
  const cul = cy + girdle + pavilion;
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    vectorEffect: "non-scaling-stroke" as const,
    strokeLinejoin: "round" as const,
  };
  const pts = [
    [cx - table / 2, top],
    [cx + table / 2, top],
    [cx + half, cy],
    [cx + half, cy + girdle],
    [cx, cul],
    [cx - half, cy + girdle],
    [cx - half, cy],
  ];
  return (
    <g>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} {...common} fill="#fff" fillOpacity={0.55} />
      <line x1={cx - half} y1={cy} x2={cx + half} y2={cy} {...common} />
      <line x1={cx - half} y1={cy + girdle} x2={cx + half} y2={cy + girdle} {...common} />
      {/* crown facets */}
      {[-0.32, 0, 0.32].map((f) => (
        <line key={`c${f}`} x1={cx + f * table} y1={top} x2={cx + f * w * 1.1} y2={cy} {...common} strokeWidth={strokeWidth * 0.7} />
      ))}
      {/* pavilion mains */}
      {[-0.5, -0.25, 0.25, 0.5].map((f) => (
        <line key={`v${f}`} x1={cx + f * w} y1={cy + girdle} x2={cx} y2={cul} {...common} strokeWidth={strokeWidth * 0.7} />
      ))}
      {step &&
        [0.33, 0.66].map((f) => (
          <line
            key={`s${f}`}
            x1={cx - half * (1 - f)}
            y1={cy + girdle + pavilion * f}
            x2={cx + half * (1 - f)}
            y2={cy + girdle + pavilion * f}
            {...common}
            strokeWidth={strokeWidth * 0.7}
          />
        ))}
    </g>
  );
}
