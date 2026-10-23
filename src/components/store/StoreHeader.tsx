import Link from "next/link";
import { AccountLink } from "@/components/store/AccountLink";
import type { StoreCategory } from "@/lib/types/store";

export function StoreHeader({ categories }: { categories: StoreCategory[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="page flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/" className="font-display text-2xl" aria-label="Store home">
          E-commerce
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/shop" className="hover:text-loupe">All products</Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/shop/${encodeURIComponent(category.slug)}`} className="hover:text-loupe">
              {category.name}
            </Link>
          ))}
        </nav>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <form action="/search" role="search" className="flex flex-1 gap-2 sm:flex-none">
            <label className="sr-only" htmlFor="store-search">Search products</label>
            <input id="store-search" name="q" className="field min-h-10" placeholder="Search products" />
            <button className="btn btn-secondary min-h-10 px-4" type="submit">Search</button>
          </form>
          <AccountLink />
        </div>
      </div>
    </header>
  );
}
