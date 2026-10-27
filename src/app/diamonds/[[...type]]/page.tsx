import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/api/products";
import { parseShopParams, toApiSearch } from "@/lib/catalog/query";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { ListingToolbar } from "@/components/catalog/ListingToolbar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductTable } from "@/components/catalog/ProductTable";
import { Pagination } from "@/components/catalog/Pagination";
import { ListingState } from "@/components/catalog/ListingState";
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

  const fixedOrigin =
    segment === "natural"
      ? "NATURAL"
      : segment === "lab-grown"
      ? "LAB_GROWN"
      : undefined;

  const { query: filters, view } = parseShopParams(rawSearch, fixedOrigin as Origin);
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
    <div className="page py-8 sm:py-12 space-y-8">
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-medium text-ink">{title}</h1>
        </div>
        <div className="inline-flex rounded-[3px] border border-line bg-platinum p-0.5 self-start">
          <Link
            href="/diamonds"
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              !fixedOrigin ? "bg-ink text-white" : "text-ink hover:bg-surface"
            }`}
          >
            All
          </Link>
          <Link
            href="/diamonds/natural"
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              fixedOrigin === "NATURAL" ? "bg-ink text-white" : "text-ink hover:bg-surface"
            }`}
          >
            Natural
          </Link>
          <Link
            href="/diamonds/lab-grown"
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              fixedOrigin === "LAB_GROWN" ? "bg-ink text-white" : "text-ink hover:bg-surface"
            }`}
          >
            Lab-Grown
          </Link>
        </div>
      </div>

      <FilterPanel />
      <ListingToolbar total={pageData?.totalItems ?? 0} />

      {loadError ? (
        <ListingState kind="error" message={loadError} resetHref={basePath} />
      ) : !pageData || pageData.items.length === 0 ? (
        <ListingState kind="empty" />
      ) : view === "list" ? (
        <ProductTable products={pageData.items} />
      ) : (
        <ProductGrid products={pageData.items} />
      )}

      {pageData && pageData.totalPages > 1 && (
        <Pagination totalPages={pageData.totalPages} basePath={basePath} query={filters} view={view} />
      )}
    </div>
  );
}