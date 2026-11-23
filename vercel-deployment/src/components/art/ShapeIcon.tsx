import { FacetDiagram } from "@/components/art/FacetDiagram";
import type { Shape } from "@/lib/types/catalog";

/** Small outline of a diamond shape, used in menus and filters. */
export function ShapeIcon({ shape, className, detailed }: { shape: Shape; className?: string; detailed?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <FacetDiagram shape={shape} cx={24} cy={24} r={21} strokeWidth={1} simple={!detailed} />
    </svg>
  );
}
