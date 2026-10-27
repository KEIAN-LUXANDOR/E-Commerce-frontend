"use client";

import Link from "next/link";

export function DiamondRow({ product }: { product: any }) {
  if (!product) return null;
  return (
    <tr className="hover:bg-platinum/50 transition-colors">
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
      <td className="p-4 text-right">
        <Link href={`/diamond/${product.id}`} className="text-[10px] uppercase tracking-widest font-medium text-ink hover:underline">
          View
        </Link>
      </td>
    </tr>
  );
}

export default DiamondRow;