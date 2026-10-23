import Link from "next/link";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { Price } from "@/components/ui/Price";
import { cutLabel, originLabel, shapeLabel } from "@/lib/catalog-labels";
import type { DiamondSummary } from "@/lib/types/catalog";

/**
 * List view: one row per diamond with every grade in its own column,
 * so stones can be compared side by side. On phones each row becomes a compact block.
 */
export function DiamondTable({ diamonds }: { diamonds: DiamondSummary[] }) {
  return (
    <div className="mt-6">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Diamonds matching your filters</caption>
        <thead className="hidden border-b border-ink md:table-header-group">
          <tr>
            {["Shape", "Carat", "Colour", "Clarity", "Cut", "Fluorescence", "Origin", "Report", "Price"].map((h, i) => (
              <th key={h} scope="col" className={`py-2.5 pr-3 font-semibold ${i === 8 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {diamonds.map((d) => {
            const href = `/product/${d.slug}`;
            return (
              <tr key={d.id} className="group relative grid grid-cols-[3rem_1fr_auto] gap-x-3 border-b border-line py-3 hover:bg-surface md:table-row md:py-0">
                <td className="row-span-2 md:py-3 md:pr-3">
                  <span className="flex items-center gap-2">
                    <ShapeIcon shape={d.shape} className="size-10 text-ink md:size-8" />
                    <span className="hidden lg:inline">{shapeLabel(d.shape)}</span>
                  </span>
                </td>
                <td className="font-medium tabular-nums md:py-3 md:pr-3">
                  {/* The whole row is clickable through this link */}
                  <Link href={href} className="after:absolute after:inset-0 group-hover:underline">
                    {d.carat.toFixed(2)} ct<span className="md:hidden"> {shapeLabel(d.shape)}</span>
                  </Link>
                </td>
                <td className="hidden tabular-nums md:table-cell md:py-3 md:pr-3">{d.color}</td>
                <td className="hidden tabular-nums md:table-cell md:py-3 md:pr-3">{d.clarity}</td>
                <td className="hidden md:table-cell md:py-3 md:pr-3">{cutLabel(d.cut)}</td>
                <td className="hidden md:table-cell md:py-3 md:pr-3">{d.fluorescence === "NONE" ? "None" : d.fluorescence.charAt(0) + d.fluorescence.slice(1).toLowerCase()}</td>
                <td className="hidden md:table-cell md:py-3 md:pr-3">{originLabel(d.origin)}</td>
                <td className="hidden tabular-nums text-slate md:table-cell md:py-3 md:pr-3">
                  {d.lab} {d.certificateNumber}
                </td>
                <td className="text-right font-medium md:py-3">
                  <Price paise={d.pricePaise} />
                </td>
                {/* Phone summary line */}
                <td className="col-span-2 text-slate md:hidden">
                  {d.color}, {d.clarity}, {cutLabel(d.cut)}, {originLabel(d.origin)}, {d.lab}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
