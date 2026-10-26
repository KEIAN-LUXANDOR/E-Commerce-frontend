import Link from "next/link";
import { CompareToggle } from "@/components/product/CompareToggle";
import { ProductImage } from "@/components/product/ProductImage";
import { SaveButton } from "@/components/product/SaveButton";
import { cutLabel, originLabel, shapeLabel } from "@/lib/catalog/labels";
import { isAvailable, mainVariant, productHref } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types/product";

/** List view: one row per diamond with every main grade, easy to scan and compare. */
export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <caption className="sr-only">Diamonds, one per row</caption>
        <thead className="bg-stone text-xs uppercase tracking-[0.08em] text-slate">
          <tr>
            <th scope="col" className="px-3 py-3 font-medium">
              <span className="sr-only">Photo</span>
            </th>
            <th scope="col" className="px-3 py-3 font-medium">Shape</th>
            <th scope="col" className="px-3 py-3 font-medium">Carat</th>
            <th scope="col" className="px-3 py-3 font-medium">Colour</th>
            <th scope="col" className="px-3 py-3 font-medium">Clarity</th>
            <th scope="col" className="px-3 py-3 font-medium">Cut</th>
            <th scope="col" className="px-3 py-3 font-medium">Origin</th>
            <th scope="col" className="px-3 py-3 font-medium">Report</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Price</th>
            <th scope="col" className="px-3 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((p) => {
            const d = p.diamond;
            const v = mainVariant(p);
            const href = productHref(p.slug);
            return (
              <tr key={p.id} className="hover:bg-stone">
                <td className="px-3 py-2">
                  <Link href={href} className="relative block size-14 border border-line bg-stone" tabIndex={-1} aria-hidden>
                    <ProductImage product={p} sizes="56px" />
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link href={href} className="font-medium hover:underline">
                    {d ? shapeLabel(d.shape) : p.name}
                  </Link>
                  {!isAvailable(p) && <span className="ml-2 text-xs font-medium uppercase text-out">Sold</span>}
                </td>
                <td className="px-3 py-2 tabular-nums">{d ? d.carat.toFixed(2) : "—"}</td>
                <td className="px-3 py-2">{d?.color ?? "—"}</td>
                <td className="px-3 py-2">{d?.clarity ?? "—"}</td>
                <td className="px-3 py-2">{d ? cutLabel(d.cut) : "—"}</td>
                <td className="px-3 py-2">{d ? originLabel(d.origin) : "—"}</td>
                <td className="px-3 py-2">{d?.lab ?? "—"}</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">{v ? formatINR(v.pricePaise) : "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <CompareToggle slug={p.slug} name={p.name} />
                    <SaveButton product={p} />
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
