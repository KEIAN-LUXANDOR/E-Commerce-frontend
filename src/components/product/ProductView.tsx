"use client";

import { Heart, ShoppingBag } from "lucide-react";

export function ProductView({ product }: { product: any }) {
  if (!product) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 py-12">
      <div className="bg-platinum aspect-square relative border border-line flex items-center justify-center">
        {/* Fallback diamond visualization */}
        <span className="text-slate uppercase tracking-widest font-medium text-xl">
          {product.shape}
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-serif text-ink mb-2">
              {product.name || `${product.carat} Carat ${product.shape}`}
            </h1>
            <p className="text-2xl font-medium text-ink">${product.price?.toLocaleString()}</p>
          </div>
          <button 
            className="p-3 border border-line bg-surface hover:border-ink transition-colors flex-shrink-0"
            aria-label="Save to wishlist"
          >
            <Heart className="h-5 w-5 text-ink" />
          </button>
        </div>

        <div className="space-y-4 mb-8 text-sm text-slate flex-1">
          <p>{product.description || "A brilliant cut diamond perfect for any setting."}</p>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-line">
            <div><span className="block text-xs uppercase text-slate mb-1">Shape</span><span className="text-ink font-medium">{product.shape}</span></div>
            <div><span className="block text-xs uppercase text-slate mb-1">Carat</span><span className="text-ink font-medium">{product.carat}</span></div>
            <div><span className="block text-xs uppercase text-slate mb-1">Color</span><span className="text-ink font-medium">{product.color}</span></div>
            <div><span className="block text-xs uppercase text-slate mb-1">Clarity</span><span className="text-ink font-medium">{product.clarity}</span></div>
            <div><span className="block text-xs uppercase text-slate mb-1">Cut</span><span className="text-ink font-medium">{product.cut}</span></div>
            <div><span className="block text-xs uppercase text-slate mb-1">Polish</span><span className="text-ink font-medium">{product.polish || "Excellent"}</span></div>
          </div>
        </div>

        <div className="pt-6 border-t border-line">
          <button className="w-full h-11 bg-ink text-white text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-loupe-deep transition-colors">
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductView;