"use client";

import { DiamondCard } from "@/components/shop/DiamondCard";
import { useRecentlyViewed } from "@/lib/stores";

/** Diamonds this shopper opened recently, kept in their browser only. */
export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const items = useRecentlyViewed()
    .filter((d) => d.slug !== excludeSlug)
    .slice(0, 4);
  if (!items.length) return null;
  return (
    <section aria-labelledby="recently-viewed" className="mt-20">
      <h2 id="recently-viewed" className="text-3xl">
        Recently viewed
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
        {items.map((d) => (
          <li key={d.slug}>
            <DiamondCard diamond={d} />
          </li>
        ))}
      </ul>
    </section>
  );
}
