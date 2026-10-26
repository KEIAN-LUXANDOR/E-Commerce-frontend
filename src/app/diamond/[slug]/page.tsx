import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { BuyBox } from "@/components/diamond/BuyBox";
import { DiamondGallery } from "@/components/diamond/DiamondGallery";
import { GradeScales } from "@/components/diamond/GradeScale";
import { ProductPageEffects } from "@/components/diamond/ProductPageEffects";
import { RecentlyViewed } from "@/components/diamond/RecentlyViewed";
import { SpecTable } from "@/components/diamond/SpecTable";
import { EmptyState } from "@/components/common/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getProduct, getSimilar } from "@/lib/api/products";
import { originLabel, shapeLabel } from "@/lib/catalog/labels";
import { isAvailable, mainVariant, plainSummary, productHref } from "@/lib/catalog/product";
import { site } from "@/lib/site";
import type { Product } from "@/lib/types/product";

type Props = PageProps<"/diamond/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProduct(slug);
  if (!product) return { title: "Diamond not found" };
  const description = `${plainSummary(product)} Free insured delivery across India and ${site.returnDays}-day returns.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: productHref(product.slug) },
    openGraph: { title: product.name, description, images: product.images[0] ? [product.images[0].url] : undefined },
  };
}

export default function DiamondPage(props: Props) {
  return (
    <Suspense fallback={<DiamondSkeleton />}>
      <DiamondContent {...props} />
    </Suspense>
  );
}

async function DiamondContent({ params }: Props) {
  const { slug } = await params;
  const { product, unavailable } = await getProduct(slug);
  if (unavailable) {
    return (
      <div className="page py-16">
        <EmptyState title="We can’t load this diamond right now" action={{ label: "Try again", href: productHref(slug) }}>
          Please try again in a minute, or message us with the link and we’ll send you the details.
        </EmptyState>
      </div>
    );
  }
  if (!product) notFound();

  const d = product.diamond;
  const originCrumb = d?.origin === "NATURAL" ? { name: "Natural diamonds", href: "/diamonds/natural" } : { name: "Lab-grown diamonds", href: "/diamonds/lab-grown" };
  const crumbs = [{ name: "Home", href: "/" }, { name: "All diamonds", href: "/diamonds" }];
  if (d) crumbs.push(originCrumb);

  return (
    <>
      <div className="page pt-6">
        <Breadcrumbs items={crumbs} current={product.name} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <DiamondGallery product={product} />
          </div>
          <BuyBox product={product} />
        </div>
      </div>

      <div className="page mt-16 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="about">
          <h2 id="about" className="text-3xl">
            About this diamond
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-secondary">{plainSummary(product)}</p>
          {product.description && <p className="mt-3 whitespace-pre-line leading-relaxed text-slate">{product.description}</p>}
          {d && (
            <div className="mt-8">
              <GradeScales color={d.color} clarity={d.clarity} />
            </div>
          )}
          <p className="mt-6 text-sm text-slate">
            New to diamonds? <Link href="/education/4cs" className="link">The 4 Cs in five minutes</Link>
            {" · "}
            <Link href="/education/reading-a-certificate" className="link">
              How to read the report
            </Link>
          </p>
        </section>

        <section aria-labelledby="details">
          <h2 id="details" className="text-3xl">
            Grading details
          </h2>
          <p className="mt-2 text-sm text-slate">From the diamond’s {d?.lab ?? "grading"} report.</p>
          <div className="mt-5">
            <SpecTable product={product} />
          </div>

          <h3 className="mt-10 text-2xl">Delivery and returns</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-secondary">
            <li>Free, fully insured delivery anywhere in India. Someone must sign for the parcel.</li>
            <li>We check the diamond against its report before it’s sealed and sent.</li>
            <li>
              Not right? Return it within {site.returnDays} days of delivery, unworn and with its report, for a full refund.{" "}
              <Link href="/returns" className="link">
                How returns work
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <Suspense fallback={null}>
        <Similar product={product} />
      </Suspense>
      <RecentlyViewed excludeSlug={product.slug} />
      <ProductPageEffects product={product} />
      <ProductJsonLd product={product} />
    </>
  );
}

async function Similar({ product }: { product: Product }) {
  const similar = await getSimilar(product, 4);
  if (similar.length === 0) return null;
  const d = product.diamond;
  let title = "You may also like";
  let href = "/diamonds";
  if (d) {
    title = `Similar ${shapeLabel(d.shape).toLowerCase()} diamonds`;
    href = `/diamonds/${d.origin === "NATURAL" ? "natural" : "lab-grown"}?shape=${d.shape.toLowerCase()}`;
  }
  return (
    <section aria-labelledby="similar" className="page mt-20">
      <div className="flex items-end justify-between gap-4">
        <h2 id="similar" className="text-3xl">
          {title}
        </h2>
        <Link href={href} className="btn-link">
          See all
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {similar.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Product structured data so Google can show price and availability. */
function ProductJsonLd({ product }: { product: Product }) {
  const v = mainVariant(product);
  const d = product.diamond;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: plainSummary(product),
    sku: v?.sku,
    brand: { "@type": "Brand", name: site.name },
    image: product.images.map((i) => (i.url.startsWith("http") ? i.url : `${site.url}${i.url}`)),
    ...(d
      ? {
          additionalProperty: [
            { "@type": "PropertyValue", name: "Carat", value: d.carat },
            { "@type": "PropertyValue", name: "Colour", value: d.color },
            { "@type": "PropertyValue", name: "Clarity", value: d.clarity },
            { "@type": "PropertyValue", name: "Origin", value: originLabel(d.origin) },
            { "@type": "PropertyValue", name: "Grading lab", value: d.lab },
          ],
        }
      : {}),
    ...(v
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: v.pricePaise / 100,
            availability: isAvailable(product) ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            url: `${site.url}${productHref(product.slug)}`,
          },
        }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      // Built from our own data; "<" is escaped so text can't close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function DiamondSkeleton() {
  return (
    <div className="page pt-6" aria-busy="true" aria-label="Loading diamond">
      <div className="skeleton h-4 w-64" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        <div className="skeleton aspect-square" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-14 w-3/4" />
          <div className="skeleton h-24" />
          <div className="skeleton h-40" />
        </div>
      </div>
    </div>
  );
}
