import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Gem } from "lucide-react";

import { getProducts } from "@/lib/api/products";
import {
  parseShopParams,
  toApiSearch,
  toShopSearch,
} from "@/lib/catalog/query";

import { FilterPanel } from "@/components/catalog/FilterPanel";
import { ListingToolbar } from "@/components/catalog/ListingToolbar";
import {
  ListingProvider,
  ListingResults,
  ListingState,
} from "@/components/catalog/ListingState";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductTable } from "@/components/catalog/ProductTable";
import { Pagination } from "@/components/catalog/Pagination";

import { cn } from "@/lib/utils";
import type {
  Origin,
  ProductQuery,
  Shape,
} from "@/lib/types/product";

interface DiamondsPageProps {
  params: Promise<{ type?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type ListingView = "grid" | "list";

const COLLECTIONS: {
  label: string;
  href: string;
  origin?: Origin;
}[] = [
  { label: "All diamonds", href: "/diamonds" },
  { label: "Natural", href: "/diamonds/natural", origin: "NATURAL" },
  { label: "Lab-grown", href: "/diamonds/lab-grown", origin: "LAB_GROWN" },
];

const DIAMOND_SHAPES: {
  label: string;
  value: Shape;
}[] = [
  { label: "Round", value: "ROUND" },
  { label: "Oval", value: "OVAL" },
  { label: "Cushion", value: "CUSHION" },
  { label: "Emerald", value: "EMERALD" },
  { label: "Pear", value: "PEAR" },
  { label: "Princess", value: "PRINCESS" },
  { label: "Radiant", value: "RADIANT" },
  { label: "Asscher", value: "ASSCHER" },
  { label: "Marquise", value: "MARQUISE" },
  { label: "Heart", value: "HEART" },
];

const SHAPE_PATHS: Partial<Record<Shape, string>> = {
  CUSHION: "M7 3H17L21 7V17L17 21H7L3 17V7Z",
  EMERALD: "M6 3H18L21 6V18L18 21H6L3 18V6Z",
  MARQUISE:
    "M12 2C8 6 4 9 4 12S8 18 12 22C16 18 20 15 20 12S16 6 12 2Z",
  PRINCESS: "M4 4H20V20H4Z",
  RADIANT: "M7 2H17L22 7V17L17 22H7L2 17V7Z",
  PEAR: "M12 2C9 6 4 10 4 15A8 8 0 0 0 20 15C20 10 15 6 12 2Z",
  HEART:
    "M12 21C10 19 3 13 3 8.5A4.5 4.5 0 0 1 12 6A4.5 4.5 0 0 1 21 8.5C21 13 14 19 12 21Z",
  ASSCHER: "M7 2H17L22 7V17L17 22H7L2 17V7Z",
};

function ShapeGlyph({ shape }: { shape: Shape }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="size-5"
      aria-hidden="true"
    >
      {shape === "ROUND" ? (
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ) : shape === "OVAL" ? (
        <ellipse
          cx="12"
          cy="12"
          rx="7"
          ry="10"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ) : (
        <path
          d={SHAPE_PATHS[shape]}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function getCollectionDetails(origin: Origin | undefined) {
  if (origin === "NATURAL") {
    return {
      eyebrow: "The natural collection",
      title: "Natural Diamonds",
      description:
        "Explore natural loose diamonds in a range of shapes, carat weights and grades. Compare the details and find a stone that feels right.",
    };
  }

  if (origin === "LAB_GROWN") {
    return {
      eyebrow: "The lab-grown collection",
      title: "Lab-Grown Diamonds",
      description:
        "Discover lab-grown loose diamonds across popular shapes, carat weights and grades. Compare certified stones and find the right one for your collection.",
    };
  }

  return {
    eyebrow: "The Keian Luxandor collection",
    title: "Loose Diamonds",
    description:
      "Explore natural and lab-grown diamonds. Compare shape, carat, colour and clarity to discover a diamond that speaks to you.",
  };
}

function CollectionNavigation({
  activeOrigin,
  filters,
  view,
}: {
  activeOrigin?: Origin;
  filters: ProductQuery;
  view: ListingView;
}) {
  const queryWithoutOrigin: ProductQuery = {
    ...filters,
    origin: undefined,
    page: 0,
  };

  return (
    <nav
      aria-label="Diamond collection"
      className="flex flex-wrap items-center gap-2"
    >
      {COLLECTIONS.map((collection) => {
        const active = collection.origin === activeOrigin;

        const href =
          collection.href +
          toShopSearch(queryWithoutOrigin, view, false);

        return (
          <Link
            key={collection.href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2",
              active
                ? "border-ink bg-ink text-white shadow-sm"
                : "border-line bg-white text-ink-secondary hover:border-brand-accent hover:bg-[var(--brand-accent-muted)] hover:text-ink",
            )}
          >
            {collection.label}
          </Link>
        );
      })}
    </nav>
  );
}

function getShapeHref({
  shape,
  basePath,
  filters,
  view,
  fixedOrigin,
}: {
  shape?: Shape;
  basePath: string;
  filters: ProductQuery;
  view: ListingView;
  fixedOrigin?: Origin;
}) {
  const currentShapes = filters.shape ?? [];

  let nextShapes: Shape[] | undefined;

  if (shape) {
    nextShapes = currentShapes.includes(shape)
      ? currentShapes.filter((item) => item !== shape)
      : [...currentShapes, shape];
  }

  const nextQuery: ProductQuery = {
    ...filters,
    shape: nextShapes?.length ? nextShapes : undefined,
    page: 0,
  };

  return basePath + toShopSearch(nextQuery, view, !fixedOrigin);
}

function ShapeNavigation({
  basePath,
  filters,
  view,
  fixedOrigin,
}: {
  basePath: string;
  filters: ProductQuery;
  view: ListingView;
  fixedOrigin?: Origin;
}) {
  const selectedShapes = filters.shape ?? [];
  const allSelected = selectedShapes.length === 0;

  return (
    <section aria-labelledby="browse-shapes-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="browse-shapes-heading"
            className="font-serif text-lg font-medium text-ink"
          >
            Browse by shape
          </h2>

          <p className="mt-1 text-xs text-slate">
            Select one or more cuts to refine your collection.
          </p>
        </div>

        <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:block">
          Diamond shapes
        </span>
      </div>

      <nav
        aria-label="Diamond shape filters"
        className="flex gap-2 overflow-x-auto border-b border-line pb-5 [scrollbar-width:thin]"
      >
        <Link
          href={getShapeHref({
            basePath,
            filters,
            view,
            fixedOrigin,
          })}
          aria-current={allSelected ? "true" : undefined}
          className={cn(
            "flex min-w-[76px] shrink-0 flex-col items-center gap-2 rounded-xl border px-3 py-3 text-[10px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2",
            allSelected
              ? "border-brand-accent bg-[var(--brand-accent-muted)] text-ink"
              : "border-line bg-white text-slate hover:border-brand-accent hover:bg-stone hover:text-ink",
          )}
        >
          <div
            className={cn(
              "grid size-9 place-items-center rounded-full",
              allSelected
                ? "bg-white text-brand-accent"
                : "bg-stone text-slate",
            )}
          >
            <Gem className="size-4" aria-hidden="true" />
          </div>

          All shapes
        </Link>

        {DIAMOND_SHAPES.map((shape) => {
          const active = selectedShapes.includes(shape.value);

          return (
            <Link
              key={shape.value}
              href={getShapeHref({
                shape: shape.value,
                basePath,
                filters,
                view,
                fixedOrigin,
              })}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex min-w-[76px] shrink-0 flex-col items-center gap-2 rounded-xl border px-3 py-3 text-[10px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2",
                active
                  ? "border-brand-accent bg-[var(--brand-accent-muted)] text-ink"
                  : "border-line bg-white text-slate hover:border-brand-accent hover:bg-stone hover:text-ink",
              )}
            >
              <div
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-colors",
                  active
                    ? "bg-white text-brand-accent"
                    : "bg-stone text-slate group-hover:text-brand-accent",
                )}
              >
                <ShapeGlyph shape={shape.value} />
              </div>

              {shape.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}

function DiamondsPageSkeleton() {
  return (
    <main
      className="page space-y-7 pb-16 pt-6 sm:space-y-8 sm:pb-20 sm:pt-8"
      aria-busy="true"
    >
      {/* Breadcrumb */}
      <div className="skeleton h-3 w-48 rounded-full" />

      {/* Collection heading */}
      <header className="flex flex-col justify-between gap-6 border-b border-line pb-7 lg:flex-row lg:items-end">
        <div className="w-full max-w-2xl">
          <div className="skeleton h-3 w-36 rounded-full" />
          <div className="skeleton mt-4 h-10 w-80 max-w-full rounded-lg" />
          <div className="skeleton mt-3 h-4 w-full max-w-xl rounded" />
          <div className="skeleton mt-2 h-4 w-2/3 max-w-md rounded" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="skeleton h-10 w-24 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
      </header>

      {/* Shape navigation */}
      <div>
        <div className="skeleton mb-3 h-5 w-36 rounded" />

        <div className="flex gap-3 overflow-hidden border-b border-line pb-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="skeleton h-[68px] w-20 shrink-0 rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Sidebar + product results */}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Mobile filter button placeholder */}
        <div className="skeleton h-11 w-full rounded-xl lg:hidden" />

        {/* Desktop filter sidebar placeholder */}
        <div className="hidden space-y-5 rounded-2xl border border-line bg-white p-5 lg:block">
          <div className="skeleton h-8 w-36 rounded" />

          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-line pb-5">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton mt-4 h-10 w-full rounded-lg" />

              {index < 2 && (
                <div className="skeleton mt-2 h-10 w-full rounded-lg" />
              )}
            </div>
          ))}
        </div>

        {/* Results placeholder */}
        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <div className="skeleton h-8 w-36 rounded" />

            <div className="flex gap-2">
              <div className="skeleton h-10 w-40 rounded-full" />
              <div className="skeleton h-10 w-20 rounded-full" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-line bg-white p-3"
              >
                <div className="skeleton aspect-square rounded-xl" />
                <div className="skeleton mt-4 h-4 w-3/4 rounded" />
                <div className="skeleton mt-2 h-3 w-1/2 rounded" />
                <div className="skeleton mt-4 h-5 w-2/3 rounded" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DiamondsPage(props: DiamondsPageProps) {
  return (
    <Suspense fallback={<DiamondsPageSkeleton />}>
      <DiamondsCatalogPage {...props} />
    </Suspense>
  );
}

async function DiamondsCatalogPage({
  params,
  searchParams,
}: DiamondsPageProps) {
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

  const { query: filters, view } = parseShopParams(
    rawSearch,
    fixedOrigin,
  );

  const apiQueryString = toApiSearch(filters);

  let pageData: Awaited<ReturnType<typeof getProducts>> | null = null;
  let loadError: string | null = null;

  try {
    pageData = await getProducts(apiQueryString);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load diamonds right now.";
  }

  const activeOrigin = fixedOrigin ?? filters.origin;
  const collection = getCollectionDetails(activeOrigin);
  const basePath = segment ? `/diamonds/${segment}` : "/diamonds";

  return (
    <ListingProvider
      query={filters}
      view={view}
      basePath={basePath}
      fixedOrigin={fixedOrigin}
      totalItems={pageData?.totalItems ?? 0}
    >
      <main className="w-full bg-white text-ink">
        <div className="page space-y-7 pb-16 pt-6 sm:space-y-8 sm:pb-20 sm:pt-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-slate">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-ink"
                >
                  Home
                </Link>
              </li>

              <li aria-hidden="true" className="text-muted">
                /
              </li>

              <li>
                <Link
                  href="/diamonds"
                  className="transition-colors hover:text-ink"
                >
                  Diamonds
                </Link>
              </li>

              {activeOrigin && (
                <>
                  <li aria-hidden="true" className="text-muted">
                    /
                  </li>

                  <li
                    aria-current="page"
                    className="font-medium text-ink"
                  >
                    {activeOrigin === "NATURAL" ? "Natural" : "Lab-grown"}
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Collection heading and origin navigation */}
          <header className="flex flex-col justify-between gap-6 border-b border-line pb-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-px w-7 bg-brand-accent" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                  {collection.eyebrow}
                </p>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                {collection.title}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate sm:text-base sm:leading-7">
                {collection.description}
              </p>
            </div>

            <CollectionNavigation
              activeOrigin={activeOrigin}
              filters={filters}
              view={view}
            />
          </header>

          {/* Shape browsing */}
          <ShapeNavigation
            basePath={basePath}
            filters={filters}
            view={view}
            fixedOrigin={fixedOrigin}
          />

          {/* Catalogue: filters on the left, results on the right */}
          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)] 2xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-8">
            {/* Filter rail
                Desktop: sticky vertical sidebar.
                Mobile: filter button and slide-in drawer.
            */}
            <div className="min-w-0">
              <FilterPanel />
            </div>

            {/* Product results */}
            <section
              id="diamond-results"
              aria-label="Diamond search results"
              className="min-w-0 scroll-mt-24"
            >
              <ListingToolbar total={pageData?.totalItems ?? 0} />

              <div className="mt-5">
                <ListingResults>
                  {loadError ? (
                    <ListingState
                      kind="error"
                      message={loadError}
                      resetHref={basePath}
                    />
                  ) : !pageData || pageData.items.length === 0 ? (
                    <ListingState kind="empty" />
                  ) : view === "list" ? (
                    <ProductTable products={pageData.items} />
                  ) : (
                    <ProductGrid
                      products={pageData.items}
                      columns={4}
                    />
                  )}
                </ListingResults>
              </div>

              {pageData && pageData.totalPages > 1 && (
                <div className="mt-8 border-t border-line pt-7">
                  <Pagination
                    totalPages={pageData.totalPages}
                    basePath={basePath}
                    query={filters}
                    view={view}
                  />
                </div>
              )}
            </section>
          </div>

          {/* Personal assistance */}
          <section className="flex flex-col justify-between gap-5 rounded-[1.4rem] border border-line bg-[var(--color-stone)] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <p className="font-serif text-lg font-medium text-ink">
                Looking for something specific?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate">
                Our team can help you compare diamonds and understand their
                grading details.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-line-dark bg-white px-5 text-xs font-semibold text-ink transition-colors hover:border-brand-accent hover:bg-[var(--brand-accent-muted)] sm:self-auto"
            >
              Speak to our team
              <ArrowUpRight
                className="size-3.5 text-brand-accent"
                aria-hidden="true"
              />
            </Link>
          </section>
        </div>
      </main>
    </ListingProvider>
  );
}