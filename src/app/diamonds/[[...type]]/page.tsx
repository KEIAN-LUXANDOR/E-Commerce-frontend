import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { CompareTray } from "@/components/catalog/CompareTray";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { ListingProvider, ListingResults } from "@/components/catalog/ListingState";
import { ListingToolbar } from "@/components/catalog/ListingToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductTable } from "@/components/catalog/ProductTable";
import { EmptyState } from "@/components/common/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getProducts } from "@/lib/api/products";
import { originFromSlug } from "@/lib/catalog/labels";
import { productHref } from "@/lib/catalog/product";
import { isFiltered, parseShopParams } from "@/lib/catalog/query";
import { site } from "@/lib/site";
import type { Origin } from "@/lib/types/product";

/**
 * /diamonds             all diamonds
 * /diamonds/natural     natural only
 * /diamonds/lab-grown   lab-grown only
 * Filters live in the address bar (see src/lib/catalog/query.ts).
 */

type Props = PageProps<"/diamonds/[[...type]]">;

const COPY: Record<"ALL" | Origin, { title: string; crumb: string; intro: string; metaTitle: string }> = {
  ALL: {
    title: "Certified diamonds",
    crumb: "All diamonds",
    intro: "Natural and lab-grown loose diamonds, each with its own IGI or GIA grading report. Filter by shape, size, colour and clarity, or ask us to help you choose.",
    metaTitle: "Certified loose diamonds",
  },
  NATURAL: {
    title: "Natural diamonds",
    crumb: "Natural diamonds",
    intro: "Diamonds formed in the earth over millions of years. Each one is graded by GIA or IGI, and the report travels with the stone.",
    metaTitle: "Natural diamonds",
  },
  LAB_GROWN: {
    title: "Lab-grown diamonds",
    crumb: "Lab-grown diamonds",
    intro: "Real diamonds, grown in a laboratory. The same sparkle and hardness as natural diamonds, at a lower price, each with its IGI or GIA report.",
    metaTitle: "Lab-grown diamonds",
  },
};

async function resolveOrigin(params: Props["params"]): Promise<{ origin?: Origin; basePath: string } | null> {
  const { type } = await params;
  if (!type || type.length === 0) return { origin: undefined, basePath: "/diamonds" };
  if (type.length > 1) return null;
  const origin = originFromSlug(type[0]);
  if (!origin) return null;
  return { origin, basePath: `/diamonds/${type[0]}` };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolved = await resolveOrigin(params);
  if (!resolved) return { title: "Page not found" };
  const copy = COPY[resolved.origin ?? "ALL"];
  const { query } = parseShopParams(await searchParams, resolved.origin);
  return {
    title: copy.metaTitle,
    description: `${copy.intro} Free insured delivery across India, ${site.returnDays}-day returns.`,
    alternates: { canonical: resolved.basePath },
    robots: isFiltered(query) || (query.page ?? 0) > 0 ? { index: false, follow: true } : undefined,
  };
}

export default function DiamondsPage(props: Props) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <Listing {...props} />
    </Suspense>
  );
}

async function Listing({ params, searchParams }: Props) {
  const { type } = await params;
  if (type?.length === 2 && originFromSlug(type[0])) redirect(productHref(type[1]));
  const resolved = await resolveOrigin(params);
  if (!resolved) notFound();
  const { origin, basePath } = resolved;
  const copy = COPY[origin ?? "ALL"];
  const { query, view } = parseShopParams(await searchParams, origin);
  const result = await getProducts(query);
  const { page } = result;

  return (
    <ListingProvider query={query} view={view} basePath={basePath} fixedOrigin={origin}>
      <section className="border-b border-line bg-white">
        <div className="page py-8 sm:py-10">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, ...(origin ? [{ name: "All diamonds", href: "/diamonds" }] : [])]} current={copy.crumb} />
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl">{copy.title}</h1>
              <p className="mt-3 text-base leading-relaxed text-slate sm:text-lg">{copy.intro}</p>
            </div>
            <ul className="grid grid-cols-3 border border-line bg-stone text-center text-sm lg:w-[26rem]">
              <li className="border-r border-line px-3 py-3">
                <span className="block font-medium">IGI or GIA</span>
                <span className="text-slate">report included</span>
              </li>
              <li className="border-r border-line px-3 py-3">
                <span className="block font-medium">Free insured</span>
                <span className="text-slate">delivery</span>
              </li>
              <li className="px-3 py-3">
                <span className="block font-medium">{site.returnDays}-day</span>
                <span className="text-slate">returns</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="bg-stone">
        <div className="page grid gap-8 py-8 lg:grid-cols-[17rem_1fr]">
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto border border-line bg-white p-5">
              <FilterPanel />
            </div>
          </aside>

          <div className="min-w-0">
            <ListingToolbar total={page.totalItems} />
            <div className="mt-5">
              <ListingResults>
                <Results unavailable={result.unavailable} error={result.error} view={view} products={page.items} />
              </ListingResults>
              <Pagination basePath={basePath} query={query} view={view} totalPages={page.totalPages} includeOrigin={!origin} />
            </div>
          </div>
        </div>
      </div>
      <CompareTray />
    </ListingProvider>
  );
}

function Results({ unavailable, error, view, products }: { unavailable: boolean; error?: string; view: "grid" | "list"; products: Parameters<typeof ProductGrid>[0]["products"] }) {
  if (unavailable) {
    return (
      <EmptyState title="We can’t load the diamonds right now" action={{ label: "Try again", href: "/diamonds" }}>
        Please try again in a minute. If it keeps happening, message us and we’ll send you options directly.
      </EmptyState>
    );
  }
  if (error) {
    return (
      <EmptyState title="Some filters weren’t understood" action={{ label: "Clear filters", href: "/diamonds" }}>
        {error}
      </EmptyState>
    );
  }
  if (products.length === 0) {
    return (
      <EmptyState title="No diamonds match all of these filters" action={{ label: "Clear filters", href: "/diamonds" }}>
        Try removing a filter or two, or tell us what you’re looking for and we’ll source it for you.
      </EmptyState>
    );
  }
  if (view === "list") return <ProductTable products={products} />;
  return <ProductGrid products={products} />;
}

function ListingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading diamonds">
      <div className="border-b border-line bg-white">
        <div className="page py-10">
          <div className="skeleton h-4 w-48" />
          <div className="skeleton mt-6 h-12 w-80" />
          <div className="skeleton mt-4 h-5 w-full max-w-xl" />
        </div>
      </div>
      <div className="bg-stone">
        <div className="page grid gap-8 py-8 lg:grid-cols-[17rem_1fr]">
          <div className="skeleton hidden h-[36rem] lg:block" />
          <div>
            <div className="skeleton h-14" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton aspect-[3/4]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
