import type { ReactNode } from "react";
import { BadgeCheck, ExternalLink, Gem, Ruler, Sparkles } from "lucide-react";
import { clarityMeaning, colorGroup, cutLabel, finishLabel, fluorescenceLabel, LABS, originLabel, shapeLabel } from "@/lib/catalog/labels";
import { mainVariant, measurementsLine } from "@/lib/catalog/product";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
 
type Row = { label: string; value: ReactNode };
 
/**
 * The diamond's grading report, laid out like a printed spec sheet:
 *   1. "At a glance" tiles for the four grades shoppers compare first (carat, colour, clarity, cut)
 *   2. Grouped cards: finish, proportions, certificate (with dotted leader lines)
 * Optional report fields (measurements, table, depth, girdle…) appear once the backend sends them.
 */
export function SpecTable({ product }: { product: Product }) {
  const d = product.diamond;
  const v = mainVariant(product);
  if (!d) return <p className="text-slate">Full grading details are available on request.</p>;
 
  const lab = LABS.find((l) => l.value === d.lab);
  const labName = lab?.full ?? d.lab;
 
  let cutHint = "How well it returns light";
  if (!d.cut) cutHint = "Fancy shapes aren’t cut-graded";
 
  const glance: { label: string; value: string; unit?: string; hint: string }[] = [
    { label: "Carat", value: d.carat.toFixed(2), unit: "ct", hint: "Weight of the stone" },
    { label: "Colour", value: d.color, hint: colorGroup(d.color) },
    { label: "Clarity", value: d.clarity, hint: clarityMeaning(d.clarity) },
    { label: "Cut", value: cutLabel(d.cut), hint: cutHint },
  ];
 
  const finish: Row[] = [
    { label: "Shape", value: shapeLabel(d.shape) },
    { label: "Polish", value: finishLabel(d.polish) },
    { label: "Symmetry", value: finishLabel(d.symmetry) },
    { label: "Fluorescence", value: fluorescenceLabel(d.fluorescence) },
  ];
 
  const proportions: Row[] = [];
  const measurements = measurementsLine(product);
  if (measurements) proportions.push({ label: "Measurements", value: measurements });
  if (d.lwRatio) proportions.push({ label: "Length to width", value: d.lwRatio.toFixed(2) });
  if (d.tablePct) proportions.push({ label: "Table", value: `${d.tablePct}%` });
  if (d.depthPct) proportions.push({ label: "Depth", value: `${d.depthPct}%` });
  if (d.girdle) proportions.push({ label: "Girdle", value: d.girdle });
  if (d.culet) proportions.push({ label: "Culet", value: d.culet });
 
  const certificate: Row[] = [
    { label: "Type", value: `${originLabel(d.origin)} diamond` },
    { label: "Graded by", value: labName },
  ];
  if (d.certificateNumber) certificate.push({ label: "Report number", value: <span className="font-mono tracking-wide">{d.certificateNumber}</span> });
  if (d.laserInscription) certificate.push({ label: "Laser inscription", value: "Report number on the girdle" });
  if (v) certificate.push({ label: "Stock number", value: <span className="font-mono tracking-wide">{v.sku}</span> });
 
  return (
    <div className="space-y-5">
      {/* 1. At a glance */}
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {glance.map((g) => (
          <div key={g.label} className="rounded-2xl border border-line bg-[#F5F0E8]/60 px-4 py-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">{g.label}</dt>
            <dd className="mt-2">
              <span className={cn("font-serif leading-none text-ink", g.value.length > 6 ? "text-2xl" : "text-3xl")}>{g.value}</span>
              {g.unit && <span className="ml-1 text-sm text-slate">{g.unit}</span>}
              <span className="mt-1.5 block text-xs leading-snug text-slate">{g.hint}</span>
            </dd>
          </div>
        ))}
      </dl>
 
      {/* 2. Grouped details: finish + proportions stacked on the left, certificate on the right (no stretching, no gaps) */}
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <div className="grid gap-4">
          <SpecGroup icon={<Sparkles className="size-4" aria-hidden />} title="Finish" note="How carefully it was cut and polished.">
            {finish}
          </SpecGroup>
 
          {proportions.length > 0 && (
            <SpecGroup icon={<Ruler className="size-4" aria-hidden />} title="Proportions" note="Size and shape, as measured by the lab.">
              {proportions}
            </SpecGroup>
          )}
        </div>
 
        <SpecGroup
          icon={<BadgeCheck className="size-4" aria-hidden />}
          title="Certificate"
          note={`Independently graded by ${lab?.label ?? d.lab}.`}
          footer={
            d.verifyUrl ? (
              <a
                href={d.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-line-dark underline-offset-4 transition-colors hover:decoration-ink"
              >
                Verify this report on {lab?.label ?? d.lab}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null
          }
        >
          {certificate}
        </SpecGroup>
      </div>
 
      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate">
        <Gem className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Every detail above is copied from the diamond’s {lab?.label ?? d.lab} grading report, and we check the stone against it before it ships.
      </p>
    </div>
  );
}
 
function SpecGroup({
  icon,
  title,
  note,
  children,
  footer,
  className,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  children: Row[];
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-5", className)} aria-label={title}>
      <header className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F5F0E8] text-ink">{icon}</span>
        <div>
          <h4 className="font-serif text-lg leading-tight text-ink">{title}</h4>
          <p className="text-xs text-slate">{note}</p>
        </div>
      </header>
      <dl className="mt-3">
        {children.map((row) => (
          <div key={row.label} className="flex items-baseline gap-3 py-2 text-sm">
            <dt className="shrink-0 text-slate">{row.label}</dt>
            <span aria-hidden className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-line-dark" />
            <dd className="text-right font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      {footer && <div className="mt-3 border-t border-line pt-3">{footer}</div>}
    </section>
  );
}
 