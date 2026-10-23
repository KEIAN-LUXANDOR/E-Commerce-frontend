import Link from "next/link";
import type { StoreCategory } from "@/lib/types/store";

export function StoreFooter({ categories }: { categories: StoreCategory[] }) {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="page flex flex-col gap-4 py-8 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
        <p>© E-commerce</p>
        <nav aria-label="Product categories" className="flex flex-wrap gap-4">
          <Link href="/shop" className="hover:text-ink">All products</Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/shop/${encodeURIComponent(category.slug)}`} className="hover:text-ink">
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
