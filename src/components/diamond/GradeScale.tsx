import { CLARITIES, COLORS } from "@/lib/catalog/labels";
import type { Clarity, DiamondColor } from "@/lib/types/product";
import { cn } from "@/lib/utils";

type ScaleItem = { value: string; label: string; band: string; tint: string };

/** Icy white (D) to a soft warm tint (M). */
const COLOUR_TINTS = ["#FFFFFF", "#FEFEFB", "#FCFBF5", "#FAF7EC", "#F8F3E2", "#F6EED7", "#F3E8CB", "#F0E1BE", "#ECD9AF", "#E8D09F"];
/** Clean (FL) to visibly included (I3). */
const CLARITY_TINTS = ["#FFFFFF", "#FDFDFE", "#FAFBFC", "#F6F8FA", "#F1F4F7", "#ECEFF3", "#E5E9EE", "#DDE2E8", "#D3D9E0", "#C8CFD8", "#BCC4CE"];

function clarityBand(value: Clarity): string {
  if (value === "FL" || value === "IF") return "Flawless";
  if (value.startsWith("VVS")) return "VVS";
  if (value.startsWith("VS")) return "VS";
  if (value.startsWith("SI")) return "SI";
  return "Included";
}

function colourVerdict(color: DiamondColor): string {
  const group = COLORS.find((c) => c.value === color)?.group;
  if (group === "Colourless") return "Looks icy white, even next to other diamonds.";
  if (group === "Near colourless") return "Looks white to most eyes, especially once set.";
  return "Shows a soft, warm tint that some people prefer.";
}

function clarityVerdict(clarity: Clarity): string {
  const band = clarityBand(clarity);
  if (band === "Flawless") return "No marks, even under 10× magnification.";
  if (band === "VVS") return "Marks are extremely hard to find, even with a jeweller’s loupe.";
  if (band === "VS") return "Eye-clean: any marks need magnification to see.";
  if (clarity === "SI1") return "Usually eye-clean; marks may show in larger stones.";
  return "Some marks may be visible without magnification.";
}

/** Colour and clarity scales with this diamond's grade pinned, so shoppers see where it sits. */
export function GradeScales({ color, clarity }: { color: DiamondColor; clarity: Clarity }) {
  return (
    <div className="space-y-6">
      <Scale
        title="Colour"
        selected={color}
        selectedBand={COLORS.find((c) => c.value === color)?.group ?? ""}
        verdict={colourVerdict(color)}
        note="Graded from D (colourless) to M (faint warm tint). D–F look icy white; G–J look white to most eyes."
        items={COLORS.map((c, i) => ({ value: c.value, label: c.label, band: shortColourBand(c.group), tint: COLOUR_TINTS[i] ?? "#FFFFFF" }))}
      />
      <Scale
        title="Clarity"
        selected={clarity}
        selectedBand={CLARITIES.find((c) => c.value === clarity)?.meaning ?? ""}
        verdict={clarityVerdict(clarity)}
        note="How few tiny natural marks the diamond has. VS2 and better usually look clean without magnification."
        items={CLARITIES.map((c, i) => ({ value: c.value, label: c.label, band: clarityBand(c.value), tint: CLARITY_TINTS[i] ?? "#FFFFFF" }))}
      />
    </div>
  );
}

function shortColourBand(group: string): string {
  if (group === "Colourless") return "Colourless";
  if (group === "Near colourless") return "Near colourless";
  return "Faint";
}

/** Consecutive items that share a band, e.g. D–F "Colourless" → one label spanning 3 columns. */
function bandsOf(items: ScaleItem[]): { band: string; span: number }[] {
  const out: { band: string; span: number }[] = [];
  for (const item of items) {
    const last = out[out.length - 1];
    if (last && last.band === item.band) last.span += 1;
    else out.push({ band: item.band, span: 1 });
  }
  return out;
}

function Scale({
  title,
  selected,
  selectedBand,
  verdict,
  note,
  items,
}: {
  title: string;
  selected: string;
  selectedBand: string;
  verdict: string;
  note: string;
  items: ScaleItem[];
}) {
  const columns = { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` };
  const thisBand = items.find((i) => i.value === selected)?.band;

  return (
    <figure className="rounded-2xl border border-line bg-white p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">{title} scale</span>
        <span className="text-sm text-slate">
          This diamond: <strong className="font-serif text-lg font-medium text-ink">{selected}</strong>
          {selectedBand && <span className="text-slate"> · {selectedBand}</span>}
        </span>
      </figcaption>

      {/* Pin above this diamond's grade */}
      <div className="mt-4 grid" style={columns} aria-hidden>
        {items.map((item) => (
          <div key={item.value} className="flex justify-center">
            {item.value === selected && (
              <span className="flex flex-col items-center">
                <span className="whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">This one</span>
                <span className="h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-ink" />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* The scale itself */}
      <ol className="mt-1 grid overflow-hidden rounded-xl border border-line-dark/70" style={columns}>
        {items.map((item, i) => {
          const isThis = item.value === selected;
          return (
            <li
              key={item.value}
              aria-current={isThis ? "true" : undefined}
              style={{ backgroundColor: item.tint }}
              className={cn(
                "relative px-0 py-3 text-center",
                i > 0 && "border-l border-line",
                isThis && "z-10 ring-2 ring-inset ring-ink",
              )}
            >
              <span className={cn("block text-[9px] font-medium tracking-tight min-[400px]:text-[11px] sm:text-sm sm:tracking-normal", isThis ? "text-ink" : "text-ink-secondary")}>{item.label}</span>
              {isThis && <span className="sr-only"> (this diamond)</span>}
            </li>
          );
        })}
      </ol>

      {/* Grade bands */}
      <div className="mt-2 grid gap-x-1" style={columns}>
        {bandsOf(items).map((b) => (
          <span
            key={b.band}
            style={{ gridColumn: `span ${b.span} / span ${b.span}` }}
            className={cn(
              "border-t pt-1.5 text-center text-[10px] leading-tight sm:text-xs",
              b.band === thisBand ? "border-ink font-semibold text-ink" : "border-line-dark text-slate",
            )}
          >
            {b.band}
          </span>
        ))}
      </div>

      <p className="mt-4 rounded-xl bg-[#F5F0E8]/70 px-4 py-3 text-sm text-ink">
        <span className="font-serif text-base italic">What this means: </span>
        {verdict}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate">{note}</p>
    </figure>
  );
}
