import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/api/products";
import { parseShopParams, toApiSearch } from "@/lib/catalog/query";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { ListingToolbar } from "@/components/catalog/ListingToolbar";
import { ListingProvider, ListingResults, ListingState } from "@/components/catalog/ListingState";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductTable } from "@/components/catalog/ProductTable";
import { Pagination } from "@/components/catalog/Pagination";
import type { Origin } from "@/lib/types/product";

interface DiamondsPageProps {
  params: Promise<{ type?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DiamondsPage(props: DiamondsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="page py-8 sm:py-12" aria-busy="true">
          <p className="eyebrow">Catalogue</p>
          <p role="status" className="mt-1 text-sm text-slate">Loading diamonds...</p>
        </div>
      }
    >
      <DiamondsCatalogPage {...props} />
    </Suspense>
  );
}

async function DiamondsCatalogPage({ params, searchParams }: DiamondsPageProps) {
  const { type } = await params;
  const rawSearch = await searchParams;

  const segment = type?.[0];
  if (type && type.length > 1) {
    notFound();
  }
  if (segment && segment !== "natural" && segment !== "lab-grown") {
    notFound();
  }

  const fixedOrigin: Origin | undefined =
    segment === "natural"
      ? "NATURAL"
      : segment === "lab-grown"
      ? "LAB_GROWN"
      : undefined;

  const { query: filters, view } = parseShopParams(rawSearch, fixedOrigin);
  const apiQueryString = toApiSearch(filters);

  let pageData = null;
  let loadError: string | null = null;

  try {
    pageData = await getProducts(apiQueryString);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unable to load diamonds right now.";
  }

  const title =
    fixedOrigin === "NATURAL"
      ? "Natural Diamonds"
      : fixedOrigin === "LAB_GROWN"
      ? "Lab-Grown Diamonds"
      : "Certified Loose Diamonds";

  const basePath = segment ? `/diamonds/${segment}` : "/diamonds";

  return (
    <ListingProvider
      query={filters}
      view={view}
      basePath={basePath}
      fixedOrigin={fixedOrigin}
      totalItems={pageData?.totalItems ?? 0}
    >
      <div className="page py-8 sm:py-12 space-y-8">
        <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-medium text-ink">{title}</h1>
          </div>
          <div className="inline-flex rounded-lg border border-line bg-stone p-1 self-start">
            <Link
              href="/diamonds"
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                !fixedOrigin ? "bg-slate-900 bg-ink text-white shadow-xs" : "text-slate hover:text-ink hover:bg-surface"
              }`}
            >
              All Diamonds
            </Link>
            <Link
              href="/diamonds/natural"
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                fixedOrigin === "NATURAL" ? "bg-slate-900 bg-ink text-white shadow-xs" : "text-slate hover:text-ink hover:bg-surface"
              }`}
            >
              Natural Mined
            </Link>
            <Link
              href="/diamonds/lab-grown"
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                fixedOrigin === "LAB_GROWN" ? "bg-slate-900 bg-ink text-white shadow-xs" : "text-slate hover:text-ink hover:bg-surface"
              }`}
            >
              Lab-Grown
            </Link>
          </div>
        </div>

        <FilterPanel />
        <ListingToolbar total={pageData?.totalItems ?? 0} />

        <ListingResults>
          {loadError ? (
            <ListingState kind="error" message={loadError} resetHref={basePath} />
          ) : !pageData || pageData.items.length === 0 ? (
            <ListingState kind="empty" />
          ) : view === "list" ? (
            <ProductTable products={pageData.items} />
          ) : (
            <ProductGrid products={pageData.items} />
          )}
        </ListingResults>

        {pageData && pageData.totalPages > 1 && (
          <Pagination totalPages={pageData.totalPages} basePath={basePath} query={filters} view={view} />
        )}
      </div>
    </ListingProvider>
  );
}