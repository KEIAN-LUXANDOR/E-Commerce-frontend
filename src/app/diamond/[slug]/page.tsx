import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getProduct, getSimilar } from "@/lib/api/products";
import { BuyBox } from "@/components/diamond/BuyBox";
import { DiamondGallery } from "@/components/diamond/DiamondGallery";
import { SpecTable } from "@/components/diamond/SpecTable";
import { GradeScales } from "@/components/diamond/GradeScale";
import { ProductCard } from "@/components/catalog/ProductCard";

interface DiamondDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function DiamondDetailPage(props: DiamondDetailPageProps) {
  return (
    <Suspense fallback={<div className="page py-12" aria-busy="true"><div className="skeleton h-96" /></div>}>
      <DiamondDetailContent {...props} />
    </Suspense>
  );
}

async function DiamondDetailContent({ params }: DiamondDetailPageProps) {
  const { slug } = await params;

  const result = await getProduct(slug);
  const product = result.product;
  if (!product) {
    notFound();
  }

  const similar = await getSimilar(product);

  const d = product.diamond;

  return (
    <div className="page py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <span aria-hidden="true">/</span>
          <li>
            <Link href="/diamonds" className="hover:text-ink">
              Diamonds
            </Link>
          </li>
          <span aria-hidden="true">/</span>
          <li className="text-ink font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-24">
          <DiamondGallery product={product} />
        </div>
        <div>
          <BuyBox product={product} />
        </div>
      </div>

      {/* Details & Specs */}
      {d && (
        <div className="border-t border-line pt-12 space-y-8">
          <div>
            <h2 className="text-xl font-medium text-ink">Grading &amp; Proportions</h2>
            <p className="mt-1 text-xs text-slate">
              Exact measurements certified by {d.lab}.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SpecTable product={product} />
            <div className="space-y-6">
              <GradeScales color={d.color} clarity={d.clarity} />
            </div>
          </div>
        </div>
      )}

      {/* Similar Diamonds */}
      {similar.length > 0 && (
        <div className="border-t border-line pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-ink">Similar Diamonds</h2>
            <Link href="/diamonds" className="text-xs font-medium text-loupe hover:underline">
              View all diamonds →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}