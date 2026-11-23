"use client";

import Link from "next/link";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/format";
import { mainVariant, productHref, shortTitle } from "@/lib/catalog/product";
import { shapeLabel, cutLabel } from "@/lib/catalog/labels";
import type { Product } from "@/lib/types/product";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto border border-line bg-surface">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-widest text-slate bg-platinum">
            <th className="p-4 font-medium">Diamond</th>
            <th className="p-4 font-medium">Shape</th>
            <th className="p-4 font-medium">Carat</th>
            <th className="p-4 font-medium">Color</th>
            <th className="p-4 font-medium">Clarity</th>
            <th className="p-4 font-medium">Cut</th>
            <th className="p-4 font-medium">Price</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => {
            const variant = mainVariant(product);
            const d = product.diamond;
            const href = productHref(product.slug);
            const title = shortTitle(product);
            const priceDisplay = variant ? formatPrice(variant.pricePaise) : "Price on request";
            const shapeDisplay = d?.shape ? shapeLabel(d.shape) : "Loose Diamond";
            const caratDisplay = d?.carat ? `${d.carat.toFixed(2)} ct` : "—";
            const colorDisplay = d?.color ?? "—";
            const clarityDisplay = d?.clarity ?? "—";
            let cutDisplay = "—";
            if (d?.cut) {
              cutDisplay = cutLabel(d.cut);
            } else if (d) {
              cutDisplay = "Fancy / Natural";
            }

            return (
              <tr key={product.id} className="hover:bg-platinum/50 transition-colors">
                <td className="p-4">
                  <Link href={href} className="font-medium text-ink hover:underline">
                    {title}
                  </Link>
                </td>
                <td className="p-4 text-slate">{shapeDisplay}</td>
                <td className="p-4 font-mono font-medium text-ink">{caratDisplay}</td>
                <td className="p-4 text-slate">{colorDisplay}</td>
                <td className="p-4 text-slate">{clarityDisplay}</td>
                <td className="p-4 text-slate">{cutDisplay}</td>
                <td className="p-4 font-medium text-ink font-mono">{priceDisplay}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <SaveButton productId={product.id} />
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