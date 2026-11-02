
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/types/product";

/** Responsive three-column grid of diamond cards. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id} className="flex min-w-0">
          <div className="w-full">
            <ProductCard product={product} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ProductGrid;
