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
import { Sparkles, ArrowRight } from "lucide-react";

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

const POPULAR_SEARCH_SUGGESTIONS = [
  { label: "1.0 Carat Round Brilliant", href: "/search?q=1+ct+round" },
  { label: "Oval F Colour VVS1", href: "/search?q=oval+F+VVS1" },
  { label: "Lab-Grown Emerald Cut", href: "/diamonds/lab-grown?shape=EMERALD" },
  { label: "Natural Certified Solitaires", href: "/diamonds/natural" },
  { label: "D Colour Flawless Grade", href: "/search?q=D+colour+flawless" },
  { label: "Quick-Ship Diamonds", href: "/diamonds?quickShip=1" },
];

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

  const hasItems = pageData && pageData.items.length > 0;

  return (
    <div className="page py-8 sm:py-12 space-y-8">
      <div className="border-b border-line pb-6 space-y-4">
        <p className="eyebrow">Search Catalogue</p>
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
      ) : !hasItems ? (
        <div className="border border-line bg-surface p-8 sm:p-12 space-y-6 max-w-2xl mx-auto mt-8 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-ink">No matching diamonds found</h2>
            <p className="text-xs text-slate leading-relaxed">
              We couldn&apos;t find loose stones matching your exact criteria. Try searching by shape, carat, or grade (e.g., &ldquo;1.5 ct oval lab F VS1&rdquo;) or explore popular curated collections below.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="size-3.5 text-loupe" />
              Popular Diamond Searches
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {POPULAR_SEARCH_SUGGESTIONS.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="border border-line bg-stone px-3 py-1.5 text-xs text-ink hover:border-ink hover:bg-surface transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-line">
            <Link
              href="/diamonds"
              className="inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
            >
              Browse Full Catalogue
              <ArrowRight className="size-3.5 ml-2" />
            </Link>
          </div>
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