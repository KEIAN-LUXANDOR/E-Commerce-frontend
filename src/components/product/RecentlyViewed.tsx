"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recent_diamonds") || "[]");
      setItems(recent.filter((p: any) => p.id !== currentId).slice(0, 4));
    } catch (e) {}
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-24 border-t border-line pt-12">
      <h2 className="text-xl font-serif text-ink mb-6 text-center">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <Link key={product.id} href={`/diamond/${product.id}`} className="group block border border-line bg-surface hover:border-ink transition-colors">
            <div className="aspect-square bg-platinum flex items-center justify-center text-xs uppercase text-slate tracking-widest">
              {product.shape}
            </div>
            <div className="p-4 text-center border-t border-line">
              <h3 className="text-sm font-medium text-ink mb-1 truncate">
                {product.name || `${product.carat} ct ${product.shape}`}
              </h3>
              <p className="text-xs text-slate">${product.price?.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;