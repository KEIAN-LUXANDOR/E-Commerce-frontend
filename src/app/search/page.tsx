import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api/products";
import { parseShopParams, toApiSearch } from "@/lib/catalog/query";
import { parseDiamondSearchText } from "@/lib/catalog/search-text";
import { ListingToolbar } from "@/components/catalog/ListingToolbar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductTable } from "@/components/catalog/ProductTable";
import { Pagination } from "@/components/catalog/Pagination";
import { ListingState } from "@/components/catalog/ListingState";
import { SearchBox } from "@/components/layout/SearchBox";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="page py-8 sm:py-12" aria-busy="true">
          <p className="eyebrow">Search</p>
          <p role="status" className="mt-1 text-sm text-slate">Loading search results...</p>
        </div>
      }
    >
      <SearchResultsPage {...props} />
    </Suspense>
  );
}

async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const rawSearch = await searchParams;
  
  const rawQ = typeof rawSearch.q === "string" ? rawSearch.q.trim() : "";
  const parsedFromText = rawQ ? parseDiamondSearchText(rawQ) : {};
  
  const { query: baseFilters, view } = parseShopParams(rawSearch);
  
  const mergedFilters = {
    ...baseFilters,
    ...parsedFromText,
    q: parsedFromText.q ?? baseFilters.q,
  };

  const apiQueryString = toApiSearch(mergedFilters);

  let pageData = null;
  let loadError: string | null = null;

  try {
    pageData = await getProducts(apiQueryString);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load search results.";
  }

  return (
    <div className="page py-8 sm:py-12 space-y-8">
      <div className="border-b border-line pb-6 space-y-4">
        <p className="eyebrow">Search</p>
        <h1 className="text-2xl sm:text-3xl font-medium text-ink">
          {rawQ ? `Results for “${rawQ}”` : "Search Diamonds"}
        </h1>
        <div className="max-w-md">
          <SearchBox />
        </div>
      </div>

      <ListingToolbar total={pageData?.totalItems ?? 0} />

      {loadError ? (
        <ListingState kind="error" message={loadError} resetHref="/diamonds" />
      ) : !pageData || pageData.items.length === 0 ? (
        <div className="border border-line bg-surface p-8 space-y-3 max-w-2xl mx-auto mt-8 text-center">
          <h2 className="text-lg font-medium text-ink">No matching diamonds found</h2>
          <p className="text-sm text-slate">
            Try searching by shape, carat, or grade (e.g. &ldquo;1.5 ct oval lab F VS1&rdquo;) or browse all stones.
          </p>
          <Link
            href="/diamonds"
            className="inline-flex h-10 mt-2 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
          >
            Browse All Diamonds
          </Link>
        </div>
      ) : view === "list" ? (
        <ProductTable products={pageData.items} />
      ) : (
        <ProductGrid products={pageData.items} />
      )}

      {pageData && pageData.totalPages > 1 && (
        <Pagination
          basePath="/search"
          query={mergedFilters}
          view={view}
          totalPages={pageData.totalPages}
        />
      )}
    </div>
  );
}