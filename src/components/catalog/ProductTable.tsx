"use client";

import Link from "next/link";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductTable({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto border border-line bg-surface">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-widest text-slate bg-platinum">
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
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-platinum/50 transition-colors">
              <td className="p-4">
                <Link href={`/diamond/${product.id}`} className="font-medium text-ink hover:underline">
                  {product.shape}
                </Link>
              </td>
              <td className="p-4">{product.carat}</td>
              <td className="p-4">{product.color}</td>
              <td className="p-4">{product.clarity}</td>
              <td className="p-4">{product.cut}</td>
              <td className="p-4 font-medium text-ink">${product.price?.toLocaleString()}</td>
              <td className="p-4 text-right flex items-center justify-end gap-3">
                {/* Fixed: Pass productId instead of product */}
                <SaveButton productId={product.id} />
                <AddToCartButton product={product} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;