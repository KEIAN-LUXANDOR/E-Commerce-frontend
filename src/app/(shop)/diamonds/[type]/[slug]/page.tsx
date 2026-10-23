/**
 * Diamond Product Detail Page (PDP)
 * Route: /diamonds/[type]/[slug]
 * e.g.  /diamonds/natural/1-50-carat-round-diamond-d-vvs1-natural-ad1001
 *
 * Server component: fetches diamond data at request time,
 * then passes it down to client islands (DiamondViewer, BuyBox, FourCsBreakdown).
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DiamondViewer } from "@/components/store/diamond-viewer";
import { BuyBox } from "@/components/store/buy-box";
import { DiamondCard } from "@/components/store/diamond-card";
import { DiamondDossierTabs } from "@/components/store/diamond-dossier-tabs";
import { mockDiamond, mockSimilar } from "@/mocks/catalog-service";

import { diamonds } from "@/mocks/data";

// ---------------------------------------------------------------------------
// Next.js route params
// ---------------------------------------------------------------------------

interface Props {
  params: Promise<{ type: string; slug: string }>;
}

export function generateStaticParams() {
  return diamonds.map((d) => ({
    type: d.origin === "NATURAL" ? "natural" : "lab-grown",
    slug: d.slug,
  }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const diamond = mockDiamond(slug);

  if (!diamond) {
    return { title: "Diamond Not Found | Keian Luxandor" };
  }

  return {
    title: diamond.seo.title,
    description: diamond.seo.description,
    openGraph: {
      title: diamond.seo.title,
      description: diamond.seo.description,
      images: diamond.gallery[0]?.url ? [{ url: diamond.gallery[0].url }] : [],
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DiamondProductPage(props: Props) {
  return (
    <Suspense fallback={<ProductLoadingFallback />}>
      <DiamondProductContent {...props} />
    </Suspense>
  );
}

async function DiamondProductContent({ params }: Props) {
  const { type, slug } = await params;

  // Validate route type segment
  const validTypes = ["natural", "lab-grown"];
  if (!validTypes.includes(type)) {
    notFound();
  }

  const diamond = mockDiamond(slug);
  if (!diamond) {
    notFound();
  }

  const similar = mockSimilar(slug);
  const title = `${diamond.carat.toFixed(2)} ct ${diamond.shape} Diamond`;

  return (
    <main className="animate-fade-in bg-white text-[var(--color-ink)]">
      {/* Breadcrumb (Jost/sans 12px, uppercase tracking-wider) */}
      <nav
        className="border-b border-[var(--color-line)] bg-white px-6 md:px-12 py-3 text-[12px] uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-2"
        aria-label="Breadcrumb"
      >
        <div className="max-w-[1360px] mx-auto w-full flex items-center gap-2">
          {diamond.breadcrumbs.map((crumb, i) => {
            const isLast = i === diamond.breadcrumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-[var(--color-ink)] font-medium" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className="hover:text-[var(--color-ink)] transition-colors"
                    >
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true" className="select-none text-[var(--brand-accent)]">›</span>
                  </>
                )}
              </span>
            );
          })}
        </div>
      </nav>

      {/* Main Product Workbench (strictly two columns 1.15fr : 1fr) */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
          {/* LEFT (MEDIA): Sticky stage with specimen images + zoom + thumbnails */}
          <div className="lg:sticky lg:top-[96px] flex flex-col gap-4">
            <DiamondViewer
              gallery={diamond.gallery}
              shape={diamond.shape}
              title={title}
              sku={diamond.sku}
              certificateNumber={diamond.certificateNumber}
            />
          </div>

          {/* RIGHT (BUY BOX strictly): Eyebrow, H1, 4 grades, price, actions */}
          <div className="flex flex-col">
            <div className="text-[12.5px] font-medium tracking-[0.16em] uppercase text-[var(--color-muted)] mb-1">
              {diamond.origin === "NATURAL" ? "NATURAL" : "LAB-GROWN"} · {diamond.lab} CERTIFIED
            </div>

            <h1 className="font-serif text-[34px] sm:text-[38px] leading-tight font-normal text-[var(--color-ink)] mb-6">
              {title}
            </h1>

            <BuyBox
              diamondId={diamond.id}
              slug={diamond.slug}
              title={title}
              shape={diamond.shape}
              pricePaise={diamond.pricePaise}
              emiFromPaise={diamond.emiFromPaise}
              available={diamond.available}
              lab={diamond.lab}
              certificateNumber={diamond.certificateNumber}
              certificateUrl={diamond.certificateUrl}
              carat={diamond.carat}
              color={diamond.color}
              clarity={diamond.clarity}
              cut={diamond.cut}
              polish={diamond.polish}
              symmetry={diamond.symmetry}
              fluorescence={diamond.fluorescence}
              tablePct={diamond.tablePct}
              depthPct={diamond.depthPct}
              lwRatio={diamond.lwRatio}
              girdle={diamond.girdle}
              culet={diamond.culet}
              laserInscription={diamond.laserInscription}
              measurements={diamond.measurements}
              imageUrl={diamond.gallery[0]?.url}
            />
          </div>
        </div>
      </div>

      {/* Tabbed Gemological Dossier & Scientific Blueprint */}
      <DiamondDossierTabs diamond={diamond} />




      {/* 'Similar diamonds': 4 clean DiamondCards */}
      {similar.length > 0 && (
        <section className="border-t border-[var(--color-line)] bg-white py-14" aria-label="Similar diamonds">
          <div className="max-w-[1360px] mx-auto px-6 md:px-12">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <h2 className="font-editorial text-[32px] font-normal text-[var(--color-ink)]">
                  Similar diamonds
                </h2>
                <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
                  Other loose {diamond.shape.toLowerCase()} diamonds with comparable proportion and clarity grades.
                </p>
              </div>
              <Link
                href={`/diamonds/${type}`}
                className="text-[13px] font-medium text-[var(--brand-accent-deep)] hover:underline"
              >
                View all {diamond.shape.toLowerCase()} diamonds →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.slice(0, 4).map((stone, i) => (
                <DiamondCard
                  key={stone.id}
                  diamond={stone}
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Help band: 'Not sure which diamond? Talk to an expert.' */}
      <section className="border-t border-b border-[var(--color-line)] bg-[var(--brand-anchor)] py-12 text-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-editorial text-[28px] font-normal text-white">
              Not sure which diamond? Talk to an expert.
            </h3>
            <p className="mt-1 text-[13.5px] text-white/75">
              Our gemologists can guide your comparison, verify certificate nuances, or schedule a 40x Loupe live video viewing.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/919898552297"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 flex-1 items-center justify-center rounded-none bg-[var(--brand-accent)] px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--canvas-dark)] transition-colors hover:bg-[var(--brand-accent-muted)] md:flex-initial"
            >
              WhatsApp Us
            </a>
            <a
              href="https://wa.me/919898552297?text=Hello%20Keian%20Luxandor,%20I%20would%20like%20to%20schedule%20a%2040x%20Loupe%20Video%20Consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 flex-1 items-center justify-center rounded-none border border-[var(--brand-accent)] px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10 md:flex-initial"
            >
              40x Loupe Video Call
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductLoadingFallback() {
  return (
    <div className="max-w-[1360px] mx-auto px-6 md:px-12 py-10 md:py-14 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16">
        <div className="aspect-square bg-[var(--color-stone)] border border-[var(--color-line)]" />
        <div className="space-y-6">
          <div className="h-4 w-32 bg-[var(--color-stone)]" />
          <div className="h-10 w-3/4 bg-[var(--color-stone)]" />
          <div className="h-8 w-48 bg-[var(--color-stone)]" />
          <div className="h-24 w-full bg-[var(--color-stone)] border border-[var(--color-line)]" />
          <div className="h-12 w-full bg-[var(--color-stone)]" />
        </div>
      </div>
    </div>
  );
}
