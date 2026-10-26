"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useRecentlyViewed } from "@/lib/stores";

/** Diamonds this shopper looked at recently (kept in this browser only). */
export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const items = useRecentlyViewed().filter((p) => p.slug !== excludeSlug).slice(0, 4);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="recent" className="page mt-20">
      <h2 id="recent" className="text-3xl">
        Recently viewed
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
