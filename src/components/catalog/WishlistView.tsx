"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/shop/wishlist";

export function WishlistView() {
  const { ids, toggle } = useWishlist();

  if (!ids || ids.length === 0) {
    return (
      <div className="p-12 text-center border border-line bg-surface">
        <p className="text-sm text-slate mb-4">Your wishlist is empty.</p>
        <Link href="/diamonds" className="text-xs font-medium uppercase tracking-widest text-ink hover:underline">
          Browse Diamonds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ids.map((id) => (
        <div key={id} className="flex items-center justify-between border border-line p-4 bg-surface">
          <Link href={`/diamond/${id}`} className="text-sm font-medium text-ink hover:underline">
            Diamond #{id}
          </Link>
          <button 
            onClick={() => toggle(id, "remove")} 
            className="text-out hover:opacity-80 p-2 transition-opacity"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default WishlistView;