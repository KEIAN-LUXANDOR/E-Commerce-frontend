
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Gem,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { getProduct, getProducts } from "@/lib/api/products";
import { BuyBox } from "@/components/diamond/BuyBox";
import { DiamondGallery } from "@/components/diamond/DiamondGallery";
import { SpecTable } from "@/components/diamond/SpecTable";
import { GradeScales } from "@/components/diamond/GradeScale";
import { ProductCard } from "@/components/catalog/ProductCard";

import type { Product } from "@/lib/types/product";
import { buttonVariants } from "@/components/ui/button";

interface DiamondDetailPageProps {
  params: Promise<{ slug: string }>;
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-7 bg-[var(--color-loupe)]" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--color-loupe)]">
        {children}
      </p>
    </div>
  );
}

const OUTLINE_LINK = buttonVariants({
  variant: "outline",
  size: "lg",
  className:
    "h-11 rounded-full border-[var(--color-line-dark)] bg-white px-5 text-xs font-semibold text-[var(--color-ink)] shadow-none transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-stone)] hover:text-[var(--color-ink)]",
});

function DiamondPageSkeleton() {
  return (
    <main className="page py-6 sm:py-8" aria-busy="true">
      <div className="skeleton h-4 w-60 max-w-full rounded-full" />

      <div className="mt-6 grid items-start gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,.92fr)] lg:gap-9">
        <div className="rounded-[1.75rem] border border-line bg-stone p-3">
          <div className="skeleton aspect-square rounded-[1.2rem]" />
          <div className="mt-4 flex gap-3">
            <div className="skeleton size-16 rounded-xl" />
            <div className="skeleton size-16 rounded-xl" />
            <div className="skeleton size-16 rounded-xl" />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-line p-6 sm:p-7">
          <div className="skeleton h-4 w-32 rounded-full" />
          <div className="skeleton mt-6 h-9 w-4/5 rounded-lg" />
          <div className="skeleton mt-3 h-4 w-2/3 rounded" />
          <div className="skeleton mt-8 h-16 w-full rounded" />
          <div className="mt-7 space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="skeleton h-8 w-full rounded" />
            ))}
          </div>
          <div className="skeleton mt-8 h-12 w-full rounded" />
        </div>
      </div>
    </main>
  );
}

function ProductLoadError({ message }: { message: string }) {
  return (
    <main className="page py-12 sm:py-20">
      <section
        role="alert"
        className="relative isolate mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-line bg-paper px-6 py-10 text-center sm:px-10 sm:py-14"
      >
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 -z-10 size-48 rounded-full border border-line"
        />

        <div className="relative">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-line bg-white text-loupe">
            <Gem className="size-6" aria-hidden="true" />
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-loupe">
            Catalogue connection
          </p>

          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Diamond details are temporarily unavailable.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate">
            We couldn&apos;t retrieve this diamond&apos;s information right now.
            Please try again shortly or return to the collection.
          </p>

          <p className="mt-4 text-xs leading-5 text-out">{message}</p>

          <Link
            href="/diamonds"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-loupe"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to diamonds
          </Link>
        </div>
      </section>
    </main>
  );
}

function SimilarDiamondsSkeleton() {
  return (
    <section
      aria-label="Loading similar diamonds"
      aria-busy="true"
      className="py-2"
    >
      <div className="skeleton h-7 w-48 rounded-lg" />
      <div className="skeleton mt-3 h-3 w-64 max-w-full rounded-full" />

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-line bg-white p-3"
          >
            <div className="skeleton aspect-square rounded-xl" />
            <div className="skeleton mt-4 h-4 w-3/4 rounded" />
            <div className="skeleton mt-2 h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}

async function SimilarDiamondsSection({
  product,
}: {
  product: Product;
}) {
  const diamond = product.diamond;

  if (!diamond) {
    return null;
  }

  const query = new URLSearchParams({
    origin: diamond.origin,
    shape: diamond.shape,
    page: "0",
    size: "8",
  });

  let similar: Product[];

  try {
    const result = await getProducts(`?${query}`);

    similar = result.items
      .filter((item) => item.slug !== product.slug)
      .slice(0, 4);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Recommendations are unavailable.";

    return (
      <p role="status" className="text-sm leading-6 text-slate">
        Similar diamonds could not be loaded: {message}
      </p>
    );
  }

  if (similar.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="similar-diamonds-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <SectionEyebrow>Continue Exploring</SectionEyebrow>

          <h2
            id="similar-diamonds-heading"
            className="mt-3 font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl"
          >
            More diamonds to consider.
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate">
            Explore other stones with similar characteristics.
          </p>
        </div>

        <Link
          href="/diamonds"
          className="inline-flex items-center gap-2 text-xs font-semibold text-loupe transition-colors hover:text-ink"
        >
          View all diamonds
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {similar.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

export default function DiamondDetailPage({
  params,
}: DiamondDetailPageProps) {
  return (
    <Suspense fallback={<DiamondPageSkeleton />}>
      <DiamondDetailContent params={params} />
    </Suspense>
  );
}

async function DiamondDetailContent({
  params,
}: DiamondDetailPageProps) {
  const { slug } = await params;

  let product: Product | null;

  try {
    product = await getProduct(slug);
  } catch (error) {
    return (
      <ProductLoadError
        message={
          error instanceof Error
            ? error.message
            : "Could not connect to the catalogue."
        }
      />
    );
  }

  if (!product) {
    notFound();
  }

  const diamond = product.diamond;

  return (
    <main className="w-full overflow-hidden bg-white text-ink">
      <div className="page pb-14 pt-5 sm:pb-20 sm:pt-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center justify-between gap-4"
        >
          <ol className="flex min-w-0 items-center gap-2 text-xs text-slate">
            <li className="shrink-0">
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>

            <li aria-hidden="true" className="text-muted">/</li>

            <li className="shrink-0">
              <Link
                href="/diamonds"
                className="transition-colors hover:text-ink"
              >
                Diamonds
              </Link>
            </li>

            <li aria-hidden="true" className="text-muted">/</li>

            <li
              aria-current="page"
              className="min-w-0 truncate font-medium text-ink"
            >
              {product.name}
            </li>
          </ol>

          <Link
            href="/diamonds"
            className="hidden shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-loupe transition-colors hover:text-ink sm:inline-flex"
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            Collection
          </Link>
        </nav>

        {/* Product and purchase */}
        <section
          aria-label="Diamond details and purchase"
          className="mt-5 grid min-w-0 items-start gap-7 sm:mt-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,.92fr)] lg:gap-9 xl:gap-10"
        >
          {/* Gallery */}
          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[1.6rem] border border-line bg-stone p-2 sm:rounded-[1.9rem] sm:p-3">
              <DiamondGallery product={product} />
            </div>

            {diamond && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className="size-4 shrink-0 text-loupe"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-slate">
                    Accompanied by a {diamond.lab} grading report
                  </span>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted">
                  Certified loose diamond
                </span>
              </div>
            )}
          </div>

          {/* BuyBox */}
          <aside className="min-w-0">
            <BuyBox product={product} />
          </aside>
        </section>

        {/* Reassurance strip */}
        {diamond && (
          <section
            aria-label="Purchase information"
            className="mt-8 overflow-hidden rounded-[1.4rem] border border-line bg-paper sm:mt-10"
          >
            <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="flex items-center gap-3 px-5 py-4 sm:px-5 sm:py-5">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-loupe">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">
                    {diamond.lab} report
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate">
                    Independent grading
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-4 sm:px-5 sm:py-5">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-loupe">
                  <Gem className="size-4" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">
                    Pre-dispatch checks
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate">
                    Matched with the grading report
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-4 sm:px-5 sm:py-5">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-loupe">
                  <Truck className="size-4" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">
                    Complimentary delivery
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate">
                    Across India
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Specifications */}
        {diamond && (
          <section
            aria-labelledby="diamond-specifications-heading"
            className="mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <SectionEyebrow>Know Your Diamond</SectionEyebrow>

                <h2
                  id="diamond-specifications-heading"
                  className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl"
                >
                  The details behind the stone.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate">
                  Explore its measurements, grading characteristics and
                  proportions as documented by {diamond.lab}.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-paper px-4 py-2">
                <ShieldCheck
                  className="size-3.5 text-loupe"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate">
                  Laboratory documentation
                </span>
              </span>
            </div>

            <div className="mt-7 grid min-w-0 gap-5 lg:grid-cols-[1.08fr_.92fr] lg:gap-6">
              <div className="min-w-0 rounded-[1.5rem] border border-line bg-white p-4 sm:rounded-[1.75rem] sm:p-6">
                <div className="mb-5 border-b border-line pb-4">
                  <p className="font-serif text-xl font-medium text-ink">
                    Diamond specifications
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    Measurements and grading information.
                  </p>
                </div>

                <SpecTable product={product} />
              </div>

              <div className="min-w-0 rounded-[1.5rem] border border-line bg-paper/60 p-4 sm:rounded-[1.75rem] sm:p-6">
                <div className="mb-5 border-b border-line pb-4">
                  <p className="font-serif text-xl font-medium text-ink">
                    Understanding the grades
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    A guide to this diamond&apos;s colour and clarity.
                  </p>
                </div>

                <GradeScales
                  color={diamond.color}
                  clarity={diamond.clarity}
                />
              </div>
            </div>
          </section>
        )}

        {/* Personal assistance */}
        <section className="mt-10 flex flex-col justify-between gap-5 rounded-[1.5rem] border border-line bg-paper px-5 py-5 sm:mt-12 sm:flex-row sm:items-center sm:px-7">
          <div>
            <p className="font-serif text-lg font-medium text-ink">
              Have a question about this diamond?
            </p>
            <p className="mt-1 text-sm leading-6 text-slate">
              Our team can help you understand the grading details before you
              decide.
            </p>
          </div>

          <Link href="/contact" className={OUTLINE_LINK}>
            Speak to our team
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>

        {/* Similar diamonds */}
        <section className="mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12">
          <Suspense fallback={<SimilarDiamondsSkeleton />}>
            <SimilarDiamondsSection product={product} />
          </Suspense>
        </section>

        {/* Back to collection */}
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <Link
            href="/diamonds"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate transition-colors hover:text-loupe"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Return to diamond collection
          </Link>

          <p className="text-xs text-muted">
            Need help choosing?{" "}
            <Link
              href="/contact"
              className="font-medium text-loupe underline-offset-4 hover:text-ink hover:underline"
            >
              Speak with our team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
