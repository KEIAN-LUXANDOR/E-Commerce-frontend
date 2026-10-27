"use client";

import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="group flex flex-col border border-line bg-surface hover:border-ink transition-colors relative">
      <div className="absolute top-2 right-2 z-10">
        {/* Fixed: Pass productId instead of product */}
        <SaveButton productId={product.id} />
      </div>
      <Link href={`/diamond/${product.id}`} className="block aspect-square relative bg-platinum overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate text-xs uppercase tracking-widest">
          {product.shape}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/diamond/${product.id}`} className="text-sm font-medium text-ink hover:underline mb-1 truncate">
          {product.name || `${product.carat} Carat ${product.shape}`}
        </Link>
        <p className="text-xs text-slate mb-4 flex-1">
          {product.color} Color • {product.clarity} Clarity • {product.cut} Cut
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-medium text-ink">${product.price?.toLocaleString()}</span>
          {/* Fixed: Removed unsupported size="md" prop */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;