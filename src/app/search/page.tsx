import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getProducts } from "@/lib/api/products";
import { parseShopParams } from "@/lib/catalog/query";

export const metadata: Metadata = {
  title: "Search Diamonds | Keian Luxandor",
  description: "Search certified natural and lab-grown diamonds.",
};

type Props = PageProps<"/search">;

export default function SearchPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<div className="page pb-16 pt-8"><div className="skeleton h-12 w-72" /></div>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({ searchParams }: Pick<Props, "searchParams">) {
  const params = await searchParams;
  const { query } = parseShopParams(params);
  const result = await getProducts(query);
  const term = query.q?.trim();

  return (
    <div className="page pb-16 pt-8">
      <h1 className="text-4xl sm:text-5xl">Search diamonds</h1>
      {term && <p className="mt-3 text-slate">Results for “{term}”</p>}
      <div className="mt-8">
        {result.unavailable ? (
          <EmptyState title="Search is temporarily unavailable" action={{ label: "Browse diamonds", href: "/diamonds" }}>
            Please try again shortly.
          </EmptyState>
        ) : result.error ? (
          <EmptyState title="We couldn’t understand that search" action={{ label: "Browse diamonds", href: "/diamonds" }}>
            {result.error}
          </EmptyState>
        ) : result.page.items.length === 0 ? (
          <EmptyState title={term ? "No diamonds found" : "Enter a search term"} action={{ label: "Browse diamonds", href: "/diamonds" }}>
            {term ? "Try another name, shape, or certificate detail." : "Use the search box above, or browse the full collection."}
          </EmptyState>
        ) : (
          <ProductGrid products={result.page.items} />
        )}
      </div>
    </div>
  );
}
