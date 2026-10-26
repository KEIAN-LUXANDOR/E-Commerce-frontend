import { CLARITIES, COLORS } from "@/lib/catalog/labels";
import type { Clarity, DiamondColor } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/** Colour and clarity scales with this diamond's grade highlighted, so shoppers see where it sits. */
export function GradeScales({ color, clarity }: { color: DiamondColor; clarity: Clarity }) {
  return (
    <div className="space-y-8">
      <Scale
        title="Colour"
        note="From D (colourless) to M (faint warm tint). D–F look icy white; G–J look white to most eyes."
        items={COLORS.map((c) => ({ value: c.value, label: c.label, caption: shortGroup(c.group) }))}
        selected={color}
      />
      <Scale
        title="Clarity"
        note="How few tiny natural marks the diamond has. VS2 and better usually look clean without magnification."
        items={CLARITIES.map((c) => ({ value: c.value, label: c.label, caption: "" }))}
        selected={clarity}
      />
    </div>
  );
}

function shortGroup(group: string): string {
  if (group === "Colourless") return "Colourless";
  if (group === "Near colourless") return "Near";
  return "Faint";
}

function Scale({ title, note, items, selected }: { title: string; note: string; items: { value: string; label: string; caption: string }[]; selected: string }) {
  return (
    <figure>
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="section-eyebrow text-ink">{title} scale</span>
        <span className="text-sm text-slate">
          This diamond: <strong className="font-medium text-ink">{selected}</strong>
        </span>
      </figcaption>
      <ol className="mt-3 grid border border-line" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item, i) => {
          const isThis = item.value === selected;
          return (
            <li
              key={item.value}
              aria-current={isThis ? "true" : undefined}
              className={cn("px-0.5 py-2 text-center", i > 0 ? "border-l border-line" : "", isThis ? "bg-ink text-white" : "bg-white")}
            >
              <span className="block text-sm font-medium">{item.label}</span>
              {isThis && <span className="mt-0.5 block text-xs">This one</span>}
              {!isThis && item.caption && <span className="mt-0.5 hidden text-xs text-slate sm:block">{item.caption}</span>}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-sm text-slate">{note}</p>
    </figure>
  );
}
