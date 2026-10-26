import { clarityMeaning, colorGroup, cutLabel, finishLabel, fluorescenceLabel, LABS, originLabel, shapeLabel } from "@/lib/catalog/labels";
import { mainVariant, measurementsLine } from "@/lib/catalog/product";
import type { Product } from "@/lib/types/product";

/** Every grading detail we have, in plain words. Optional report fields appear once the backend sends them. */
export function SpecTable({ product }: { product: Product }) {
  const d = product.diamond;
  const v = mainVariant(product);
  if (!d) return <p className="text-slate">Full grading details are available on request.</p>;

  const rows: [string, string][] = [
    ["Shape", shapeLabel(d.shape)],
    ["Carat weight", `${d.carat.toFixed(2)} ct`],
    ["Colour", `${d.color} (${colorGroup(d.color).toLowerCase()})`],
    ["Clarity", `${d.clarity} (${clarityMeaning(d.clarity).toLowerCase()})`],
    ["Cut", cutLabel(d.cut)],
    ["Polish", finishLabel(d.polish)],
    ["Symmetry", finishLabel(d.symmetry)],
    ["Fluorescence", fluorescenceLabel(d.fluorescence)],
    ["Type", `${originLabel(d.origin)} diamond`],
    ["Grading lab", LABS.find((l) => l.value === d.lab)?.full ?? d.lab],
  ];
  const measurements = measurementsLine(product);
  if (measurements) rows.push(["Measurements", measurements]);
  if (d.lwRatio) rows.push(["Length to width", d.lwRatio.toFixed(2)]);
  if (d.tablePct) rows.push(["Table", `${d.tablePct}%`]);
  if (d.depthPct) rows.push(["Depth", `${d.depthPct}%`]);
  if (d.girdle) rows.push(["Girdle", d.girdle]);
  if (d.culet) rows.push(["Culet", d.culet]);
  if (d.certificateNumber) rows.push(["Report number", d.certificateNumber]);
  if (d.laserInscription) rows.push(["Laser inscription", "Report number inscribed on the girdle"]);
  if (v) rows.push(["Stock number", v.sku]);

  return (
    <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
      {rows.map(([k, val]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
          <dt className="text-slate">{k}</dt>
          <dd className="text-right font-medium">{val}</dd>
        </div>
      ))}
    </dl>
  );
}
