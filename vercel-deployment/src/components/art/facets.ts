import type { Shape } from "@/lib/types/catalog";

/**
 * Geometry for facet diagrams, drawn like the plotting diagram on a grading report.
 * Coordinates are in a unit box (-1…1), y pointing down. Callers scale them.
 */

export type Pt = [number, number];

const TAU = Math.PI * 2;
const sgn = (n: number) => (n < 0 ? -1 : 1);

function superellipse(t: number, a: number, b: number, p: number): Pt {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [a * sgn(c) * Math.abs(c) ** (2 / p), b * sgn(s) * Math.abs(s) ** (2 / p)];
}

/** Point on the girdle (outline) for parameter t. t = -π/2 is the top of the stone. */
export function girdlePoint(shape: Shape, t: number): Pt {
  const c = Math.cos(t);
  const s = Math.sin(t);
  switch (shape) {
    case "ROUND":
      return [c, s];
    case "OVAL":
      return [0.74 * c, s];
    case "CUSHION":
      return superellipse(t, 0.92, 0.92, 3.2);
    case "PRINCESS":
      return superellipse(t, 0.86, 0.86, 14);
    case "RADIANT":
      return superellipse(t, 0.72, 0.94, 7);
    case "MARQUISE":
      return [0.56 * c * Math.abs(c) ** 0.55, s];
    case "PEAR": {
      // Pointed top, round bottom
      const top = s < 0;
      return [0.74 * c * (top ? Math.abs(c) ** 0.85 : 1), top ? s : 0.86 * s + 0.0];
    }
    case "HEART": {
      const x = Math.sin(t + Math.PI / 2) ** 3;
      const u = t + Math.PI / 2;
      const y = -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) / 16 - 0.12;
      return [x * 0.98, y * 0.98];
    }
    case "EMERALD":
    case "ASSCHER":
      return stepOutline(shape, t);
  }
}

/** Rectangle with cut corners, used by step cuts. */
function cutRect(w: number, h: number, cut: number): Pt[] {
  return [
    [-w + cut, -h],
    [w - cut, -h],
    [w, -h + cut],
    [w, h - cut],
    [w - cut, h],
    [-w + cut, h],
    [-w, h - cut],
    [-w, -h + cut],
  ];
}

function stepDims(shape: Shape) {
  return shape === "ASSCHER" ? { w: 0.86, h: 0.86, cut: 0.3 } : { w: 0.64, h: 0.94, cut: 0.17 };
}

function stepOutline(shape: Shape, t: number): Pt {
  const { w, h } = stepDims(shape);
  return superellipse(t, w, h, 12);
}

const isStepCut = (s: Shape) => s === "EMERALD" || s === "ASSCHER";

export interface FacetGeometry {
  outline: Pt[];
  /** Closed polygons (table, step rings) */
  polygons: Pt[][];
  /** Single facet lines */
  lines: [Pt, Pt][];
  /** Triangles that catch light, used for the "fire" effect */
  stars: Pt[][];
}

const scale = (p: Pt, k: number): Pt => [p[0] * k, p[1] * k];

export function facetGeometry(shape: Shape): FacetGeometry {
  if (isStepCut(shape)) {
    const { w, h, cut } = stepDims(shape);
    const rings = (shape === "ASSCHER" ? [1, 0.8, 0.6, 0.42] : [1, 0.8, 0.62, 0.46]).map((k) =>
      cutRect(w * k, h * (k === 1 ? 1 : k + (1 - k) * 0.12), cut * k),
    );
    const lines: [Pt, Pt][] = [];
    for (let i = 0; i < 8; i++) {
      for (let r = 0; r < rings.length - 1; r++) lines.push([rings[r][i], rings[r + 1][i]]);
    }
    const outer = rings[0];
    const stars = [0, 2, 4, 6].map((i) => [rings[1][i], rings[2][i], rings[2][(i + 1) % 8], rings[1][(i + 1) % 8]]);
    return { outline: outer, polygons: rings.slice(1), lines, stars };
  }

  const N = 8;
  const step = TAU / N;
  const t0 = -Math.PI / 2;
  const main = (k: number) => t0 + k * step;
  const half = (k: number) => main(k) + step / 2;

  const outline = Array.from({ length: 96 }, (_, i) => girdlePoint(shape, t0 + (i * TAU) / 96));
  const table = Array.from({ length: N }, (_, k) => scale(girdlePoint(shape, half(k)), 0.5));
  const star = Array.from({ length: N }, (_, k) => scale(girdlePoint(shape, main(k)), 0.73));
  const bezelBottom = Array.from({ length: N }, (_, k) => girdlePoint(shape, half(k)));
  const mainGirdle = Array.from({ length: N }, (_, k) => girdlePoint(shape, main(k)));

  const lines: [Pt, Pt][] = [];
  const stars: Pt[][] = [];
  for (let k = 0; k < N; k++) {
    const prev = (k + N - 1) % N;
    // star facet: two table corners to the star tip
    lines.push([table[prev], star[k]], [star[k], table[k]]);
    stars.push([table[prev], star[k], table[k]]);
    // bezel (kite) lower edges
    lines.push([star[k], bezelBottom[k]], [star[k], bezelBottom[prev]]);
    // bezel centre line from table corner to girdle
    lines.push([table[k], bezelBottom[k]]);
    // upper girdle split
    lines.push([star[k], mainGirdle[k]]);
  }
  return { outline, polygons: [table], lines, stars };
}

export const toPoints = (pts: Pt[], cx: number, cy: number, r: number) =>
  pts.map(([x, y]) => `${(cx + x * r).toFixed(2)},${(cy + y * r).toFixed(2)}`).join(" ");
