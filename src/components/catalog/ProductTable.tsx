import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";

interface ProductTableProps {
  products: Product[];
}

function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

function formatLabel(val?: string | null): string {
  if (!val) return "—";
  if (val === "LAB_GROWN") return "Lab-Grown";
  if (val === "NATURAL") return "Natural";
  return val
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-x-auto border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink bg-platinum/50 text-xs font-semibold uppercase tracking-wider text-ink">
            <th className="py-3 pl-4 pr-3">Diamond</th>
            <th className="px-3 py-3">Origin</th>
            <th className="px-3 py-3 tabular-nums">Carat</th>
            <th className="px-3 py-3">Colour</th>
            <th className="px-3 py-3">Clarity</th>
            <th className="px-3 py-3 hidden md:table-cell">Cut</th>
            <th className="px-3 py-3 hidden lg:table-cell">Lab</th>
            <th className="px-3 py-3 text-right">Price</th>
            <th className="py-3 pl-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => {
            const v = product.variants?.[0] ?? null;
            const d = product.diamond;
            return (
              <tr
                key={product.id}
                className="hover:bg-platinum/40 transition-colors"
              >
                <td className="py-3 pl-4 pr-3">
                  <Link
                    href={`/diamond/${product.slug}`}
                    className="flex items-center gap-2.5 font-medium text-ink hover:text-loupe"
                  >
                    <ShapeIcon
                      shape={d?.shape ?? "ROUND"}
                      className="h-5 w-5 shrink-0 text-ink"
                    />
                    <span>
                      {d ? `${d.carat.toFixed(2)} ct ${formatLabel(d.shape)}` : product.name}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-xs text-slate">
                  {d ? formatLabel(d.origin) : "—"}
                </td>
                <td className="px-3 py-3 tabular-nums text-ink">
                  {d ? d.carat.toFixed(2) : "—"}
                </td>
                <td className="px-3 py-3 text-ink">{d?.color ?? "—"}</td>
                <td className="px-3 py-3 text-ink">{d?.clarity ?? "—"}</td>
                <td className="px-3 py-3 hidden md:table-cell text-slate">
                  {d?.cut ? formatLabel(d.cut) : "—"}
                </td>
                <td className="px-3 py-3 hidden lg:table-cell text-slate">
                  {d?.lab ?? "—"}
                </td>
                <td className="px-3 py-3 text-right font-medium tabular-nums text-ink">
                  {v ? formatINR(v.pricePaise) : "Sold"}
                </td>
                <td className="py-3 pl-3 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <SaveButton product={product} />
                    <AddToCartButton product={product} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;