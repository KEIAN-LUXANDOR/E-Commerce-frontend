"use client";

import { SaveButton } from "@/components/product/SaveButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function BuyBox({ product }: { product: any }) {
  if (!product) return null;

  return (
    <div className="border border-line bg-surface p-6 sticky top-24">
      <h1 className="text-2xl font-serif text-ink mb-2">
        {product.name || `${product.carat} Carat ${product.shape}`}
      </h1>
      <p className="text-xl font-medium text-ink mb-6">
        ${product.price?.toLocaleString()}
      </p>

      <div className="space-y-3 mb-8 text-sm text-slate">
        <div className="flex justify-between border-b border-line pb-2">
          <span>Shape</span><span className="text-ink font-medium">{product.shape}</span>
        </div>
        <div className="flex justify-between border-b border-line pb-2">
          <span>Carat</span><span className="text-ink font-medium">{product.carat}</span>
        </div>
        <div className="flex justify-between border-b border-line pb-2">
          <span>Color</span><span className="text-ink font-medium">{product.color}</span>
        </div>
        <div className="flex justify-between border-b border-line pb-2">
          <span>Clarity</span><span className="text-ink font-medium">{product.clarity}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span>Cut</span><span className="text-ink font-medium">{product.cut}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AddToCartButton product={product} />
        <div className="w-full flex justify-center border border-line hover:border-ink transition-colors h-11 items-center">
          <SaveButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}

export default BuyBox;