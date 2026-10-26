import { DiamondProfile, FacetDiagram } from "@/components/art/FacetDiagram";
import type { Shape } from "@/lib/types/catalog";

export type ArtView = "top" | "profile";

const STEP_CUTS: Shape[] = ["EMERALD", "ASSCHER"];

/**
 * Line drawing of the stone, standing in for photos until real photography is uploaded.
 * "top" is the face-up facet diagram, "profile" the side view.
 * `turn` (0–359) is used by the 360° viewer: the face-up view turns like a stone on a turntable.
 */
export function DiamondArt({ shape, view = "top", turn = 0, title, className }: { shape: Shape; view?: ArtView; turn?: number; title?: string; className?: string }) {
  const accessibleTitle = title ?? `${shape.charAt(0)}${shape.slice(1).toLowerCase()} diamond illustration`;
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={accessibleTitle} className={className} preserveAspectRatio="xMidYMid meet">
      <g className="text-ink" style={turn ? { transform: `rotate(${turn}deg)`, transformOrigin: "200px 200px" } : undefined}>
        {view === "top" ? (
          <FacetDiagram shape={shape} cx={200} cy={200} r={150} strokeWidth={1.1} />
        ) : (
          <DiamondProfile cx={200} cy={170} w={300} strokeWidth={1.1} step={STEP_CUTS.includes(shape)} />
        )}
      </g>
    </svg>
  );
}
