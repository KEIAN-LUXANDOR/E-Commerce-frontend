"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function DiamondCard({ product }: { product: any }) {
  if (!product) return null;

  return (
    <div className="group flex flex-col border border-line bg-surface hover:border-ink transition-colors relative">
      <div className="absolute top-2 right-2 z-10">
        <button className="p-2 border border-line bg-surface hover:border-ink transition-colors" aria-label="Save">
          <Heart className="h-4 w-4 text-ink" />
        </button>
      </div>
      <Link href={`/diamond/${product.id}`} className="block aspect-square relative bg-platinum overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate text-xs uppercase tracking-widest">
          {product.shape}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/diamond/${product.id}`} className="text-sm font-medium text-ink hover:underline mb-1 truncate">
          {product.name || `${product.carat} ct ${product.shape}`}
        </Link>
        <p className="text-xs text-slate mb-4 flex-1">
          {product.color} Color • {product.clarity} Clarity • {product.cut} Cut
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-medium text-ink">${product.price?.toLocaleString()}</span>
          <button className="text-[10px] uppercase tracking-widest font-medium text-ink hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiamondCard;