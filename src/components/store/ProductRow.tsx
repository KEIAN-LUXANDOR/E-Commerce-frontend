import Link from "next/link";
import { ProductGrid } from "@/components/store/ProductGrid";
import type { StoreProduct } from "@/lib/types/store";

/** A titled row of up to four products; hidden when there are none. */
export function ProductRow({ id, title, products, link }: { id: string; title: string; products: StoreProduct[]; link?: { href: string; label: string } }) {
  if (!products.length) return null;
  return (
    <section aria-labelledby={id}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className="text-3xl sm:text-4xl">
          {title}
        </h2>
        {link && (
          <Link href={link.href} className="link shrink-0 text-sm">
            {link.label}
          </Link>
        )}
      </div>
      <div className="mt-6">
        <ProductGrid products={products.slice(0, 4)} columns={4} />
      </div>
    </section>
  );
}
