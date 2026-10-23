import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ListingSkeleton, StoreListing } from "@/components/store/StoreListing";
import { getStoreCategories, getStoreProducts } from "@/lib/api/store";
import { parseStoreFilters } from "@/lib/store-query";

/**
 * /shop               all diamonds
 * /shop/[category]    one category, e.g. /shop/lab-grown-diamonds
 * Filters are in the address: q, minPrice/maxPrice (rupees), sort, page (from 0), size.
 */

type Props = PageProps<"/shop/[[...category]]">;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const basePath = category?.length ? `/shop/${category[0]}` : "/shop";
  const sp = await searchParams;
  const filtered = ["q", "minPrice", "maxPrice"].some((k) => sp[k]);
  if (!category?.length) {
    return {
      title: "Certified diamonds",
      description: "Browse certified natural and lab-grown diamonds. Insured delivery across India.",
      alternates: { canonical: basePath },
      robots: filtered ? { index: false, follow: true } : undefined,
    };
  }
  const categories = await getStoreCategories();
  const current = category.length === 1 ? categories.find((c) => c.slug === category[0]) : undefined;
  if (!current) return { title: "Page not found" };
  return {
    title: current.name,
    description: `${current.name}: certified, with insured delivery across India.`,
    alternates: { canonical: basePath },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default function ShopPage(props: Props) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <ShopResults {...props} />
    </Suspense>
  );
}

async function ShopResults({ params, searchParams }: Props) {
  const [{ category }, raw] = await Promise.all([params, searchParams]);
  if (category && category.length > 1) notFound();

  const categories = await getStoreCategories();
  const slug = category?.[0];
  const current = slug ? categories.find((c) => c.slug === slug) : undefined;
  if (slug && !current) notFound();

  const filters = parseStoreFilters(raw, current?.slug);
  const result = await getStoreProducts(filters);
  const basePath = current ? `/shop/${encodeURIComponent(current.slug)}` : "/shop";

  return (
    <StoreListing
      result={result}
      filters={filters}
      basePath={basePath}
      categories={categories}
      currentSlug={current?.slug}
      header={
        <header>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, ...(current ? [{ name: "All diamonds", href: "/shop" }] : [])]} current={current?.name ?? "All diamonds"} />
          <h1 className="mt-4 text-4xl sm:text-5xl">{current?.name ?? "Certified diamonds"}</h1>
          <p className="mt-3 max-w-2xl text-slate">
            Every diamond comes with its grading report, and the report number is inscribed on the stone so you can check it yourself.
          </p>
        </header>
      }
    />
  );
}
