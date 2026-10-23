"use client";

import { ProductGrid } from "@/components/store/ProductGrid";
import { useRecentProducts } from "@/lib/stores";

/** Products this shopper opened recently, kept in their browser only. */
export function RecentProducts({ excludeSlug }: { excludeSlug?: string }) {
  const items = useRecentProducts()
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, 4);
  if (!items.length) return null;
  return (
    <section aria-labelledby="recently-viewed" className="mt-20">
      <h2 id="recently-viewed" className="text-3xl">
        Recently viewed
      </h2>
      <div className="mt-6">
        <ProductGrid products={items} columns={4} />
      </div>
    </section>
  );
}
