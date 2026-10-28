import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/types/product";

/** Responsive grid of diamond cards. */
export function ProductGrid({ products, columns = 3 }: { products: Product[]; columns?: 3 | 4 }) {
  const cols = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-3";
  return (
    <ul className={`grid grid-cols-1 gap-4 ${cols}`}>
      {products.map((p) => (
        <li key={p.id} className="flex">
          <div className="w-full">
            <ProductCard product={p} />
          </div>
        </li>
      ))}
    </ul>
  );
}
