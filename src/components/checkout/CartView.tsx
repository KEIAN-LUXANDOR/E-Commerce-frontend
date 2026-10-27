"use client";

import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";

export function CartView({ items, removeItem, updateQuantity }: any) {
  if (!items || items.length === 0) {
    return (
      <div className="p-12 text-center border border-line bg-surface">
        <p className="text-sm text-slate mb-4">Your cart is empty.</p>
        <Link href="/diamonds" className="text-xs font-medium uppercase tracking-widest text-ink hover:underline">
          Browse Diamonds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item: any) => (
        <div key={item.id} className="flex gap-4 p-4 border border-line bg-surface">
          <div className="w-24 h-24 relative bg-platinum flex-shrink-0">
            {/* Added required sizes prop */}
            <ProductImage product={item.product} sizes="96px" className="object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link href={`/diamond/${item.productId}`} className="text-sm font-medium text-ink hover:underline">
                {item.product?.name || `Diamond #${item.productId}`}
              </Link>
              <p className="text-xs text-slate mt-1">
                {item.product?.carat} Carat • {item.product?.color} • {item.product?.clarity}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">${item.price?.toLocaleString()}</span>
              <div className="flex items-center gap-3">
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="h-8 border border-line bg-surface px-2 text-xs text-ink"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-out hover:opacity-80 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartView;