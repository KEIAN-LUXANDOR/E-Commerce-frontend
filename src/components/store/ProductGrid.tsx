import Link from "next/link";
import type { StoreProduct } from "@/lib/types/store";
import { ProductCard } from "@/components/store/ProductCard";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  columns = 4,
}: {
  products: StoreProduct[];
  emptyMessage?: string;
  columns?: number;
}) {
  if (!products.length) {
    return (
      <div className="rounded border border-line bg-surface px-6 py-12 text-center">
        <p className="text-slate">{emptyMessage}</p>
        <Link href="/shop" className="btn btn-secondary mt-5">
          Browse all products
        </Link>
      </div>
    );
  }

  const colClass = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <ul className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${colClass}`}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
