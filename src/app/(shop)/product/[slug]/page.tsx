import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductRow } from "@/components/store/ProductRow";
import { RecentProducts } from "@/components/store/RecentProducts";
import { StoreProductView } from "@/components/store/StoreProductView";
import { getStoreProduct, getStoreProducts } from "@/lib/api/store";
import { site } from "@/lib/site";
import type { StoreProduct } from "@/lib/types/store";

type Props = PageProps<"/product/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) return { title: "Diamond not found" };
  return {
    title: product.name,
    description: product.description ?? `${product.name}, certified, with insured delivery across India.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, images: product.images[0] ? [product.images[0].url] : undefined },
  };
}

export default function ProductPage(props: Props) {
  return (
    <div className="page pt-6">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent {...props} />
      </Suspense>
    </div>
  );
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) notFound();
  const more = await getStoreProducts({ sort: "newest", page: 0, size: 5 });

  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "All diamonds", href: "/shop" }]} current={product.name} />
      <div className="mt-6">
        <StoreProductView product={product} />
      </div>

      {product.description && (
        <section aria-labelledby="about" className="mt-16 max-w-prose">
          <h2 id="about" className="text-2xl">
            About this diamond
          </h2>
          <p className="mt-3 whitespace-pre-line text-slate">{product.description}</p>
        </section>
      )}

      <div className="mt-20">
        <ProductRow id="more" title="More diamonds" products={more.items.filter((p) => p.slug !== product.slug)} link={{ href: "/shop", label: "See all" }} />
      </div>
      <RecentProducts excludeSlug={product.slug} />
      <ProductJsonLd product={product} />
    </>
  );
}

/** Product structured data so Google can show price and availability. */
function ProductJsonLd({ product }: { product: StoreProduct }) {
  const prices = product.variants.map((v) => v.pricePaise / 100);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: site.name },
    image: product.images.map((i) => (i.url.startsWith("http") ? i.url : `${site.url}${i.url}`)),
    ...(prices.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: product.variants.some((v) => v.inStock) ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            url: `${site.url}/product/${product.slug}`,
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

function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading diamond">
      <div className="skeleton h-4 w-64 rounded" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="skeleton aspect-square" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-48 rounded" />
          <div className="skeleton h-12 w-3/4 rounded" />
          <div className="skeleton h-8 w-40 rounded" />
          <div className="skeleton h-12 rounded" />
        </div>
      </div>
    </div>
  );
}
