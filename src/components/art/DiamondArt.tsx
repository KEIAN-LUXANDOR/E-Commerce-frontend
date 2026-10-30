
import { DiamondProfile, FacetDiagram } from "@/components/art/FacetDiagram";
import type { Shape } from "@/lib/types/catalog";

export type ArtView = "top" | "profile";

const STEP_CUTS: Shape[] = ["EMERALD", "ASSCHER"];

/**
 * Line drawing of the stone, standing in for photos until real photography is uploaded.
 * "top" is the face-up facet diagram, "profile" the side view.
 * `turn` (0–359) rotates only the face-up view in the 360° viewer.
 */
export function DiamondArt({
  shape,
  view = "top",
  turn = 0,
  title,
  className,
}: {
  shape: Shape;
  view?: ArtView;
  turn?: number;
  title?: string;
  className?: string;
}) {
  const accessibleTitle =
    title ??
    `${shape.charAt(0)}${shape.slice(1).toLowerCase()} diamond illustration`;

  const rotation = ((turn % 360) + 360) % 360;

  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={accessibleTitle}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {view === "top" ? (
        <g
          className="text-ink"
          style={
            rotation
              ? {
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "200px 200px",
                }
              : undefined
          }
        >
          <FacetDiagram
            shape={shape}
            cx={200}
            cy={200}
            r={150}
            strokeWidth={1.1}
          />
        </g>
      ) : (
        <g className="text-ink">
          <DiamondProfile
            cx={200}
            cy={170}
            w={300}
            strokeWidth={1.1}
            step={STEP_CUTS.includes(shape)}
          />
        </g>
      )}
    </svg>
  );
}
