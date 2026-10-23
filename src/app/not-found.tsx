import Link from "next/link";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { SearchBox } from "@/components/layout/SearchBox";
import { getStoreCategories } from "@/lib/api/store";

export const metadata = { title: "Page not found" };

export default async function NotFound() {
  const categories = await getStoreCategories();
  return (
    <div className="page grid gap-12 py-20 md:grid-cols-[1fr_auto] md:items-center">
      <div className="max-w-xl">
        <h1 className="text-4xl sm:text-5xl">This page isn’t here</h1>
        <p className="mt-4 text-lg text-slate">The link may be old, or the diamond may have been sold. Search for what you were looking for, or start from a category.</p>
        <SearchBox className="mt-8 max-w-md" />
        <ul className="mt-8 flex flex-wrap gap-2">
          <li>
            <Link href="/shop" className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm hover:border-ink">
              All diamonds
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/shop/${encodeURIComponent(c.slug)}`} className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm hover:border-ink">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ShapeIcon shape="PEAR" detailed className="mx-auto hidden size-64 text-line md:block" />
    </div>
  );
}
