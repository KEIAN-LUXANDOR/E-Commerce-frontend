import { HeroCarousel } from "@/components/home/HeroCarousel";
import { EditorialMonographBanner } from "@/components/home/EditorialMonographBanner";
import { EditorialMarqueeRibbon } from "@/components/home/EditorialMarqueeRibbon";
import { FindYourDiamond, Reveal } from "@/components/home/HomeMotion";
import {
  OriginCompare,
  HowItWorks,
  ClientReviews,
  GemologistConciergeBand,
  HomeFAQ,
} from "@/components/home/HomeSections";
import Link from "next/link";
import { Suspense } from "react";
import type { Banner } from "@/lib/types/catalog";
import { HomeProductCard as ProductCard } from "@/components/home/HomeProductCard";
import { getNewArrivals } from "@/lib/api/products";

/**
 * Home page (10 sections): hero · trust ribbon · find your diamond (shape/size/budget) ·
 * natural vs lab-grown · new this month · how it works + 4 Cs · editorial banner ·
 * talk to a gemologist · client reviews · FAQ.
 */
// NOTE: home page content is being redone by hand. Only the data source and links were updated here.
export default function HomePage() {
  const naturalHref = "/diamonds/natural";
  const labHref = "/diamonds/lab-grown";

  const banners: Banner[] = [
    {
      id: "b1",
      title: "Every diamond, certified and inspected.",
      text: "Natural diamonds graded by GIA and lab-grown diamonds graded by IGI. Clear grades, honest prices, complimentary delivery in India and international enquiries by request.",
      ctaLabel: "Shop now",
      ctaHref: "/diamonds",
      shape: "ROUND",
      startsAt: "",
      endsAt: "",
    },
    {
      id: "b2",
      title: "Lab-Grown Brilliance, Identical Fire",
      text: "Chemically, physically, and optically identical to mined diamonds. Certified by IGI and accessible directly at precision atelier pricing.",
      ctaLabel: "Browse Lab-Grown Diamonds",
      ctaHref: labHref,
      shape: "OVAL",
      startsAt: "",
      endsAt: "",
    },
    {
      id: "b3",
      title: "Architectural Step Cuts & Radiant Fire",
      text: "Emerald and Asscher cuts showcase mesmerizing hall-of-mirrors clarity. Every specimen is inspected and guaranteed eye-clean.",
      ctaLabel: "Discover Emerald Cuts",
      ctaHref: "/diamonds?shape=emerald",
      shape: "EMERALD",
      startsAt: "",
      endsAt: "",
    },
  ];

  return (
    <>
      {/* 1. Hero (with an Aceternity-style spotlight glow) */}
      <HeroCarousel banners={banners} />

      {/* 2. Moving trust ribbon (Magic UI marquee) */}
      <EditorialMarqueeRibbon />

      {/* 3. Find your diamond: shape, size or budget, in one tabbed section */}
      <FindYourDiamond />

      {/* 4. Natural or Lab-Grown */}
      <OriginCompare naturalHref={naturalHref} labHref={labHref} />

      {/* 5. New This Month */}
      <section className="w-full border-b border-line bg-white py-16 lg:py-20" id="new-month">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <span className="section-eyebrow mb-2">Fresh arrivals</span>
              <h2 id="new" className="font-serif text-[32px] font-normal text-ink sm:text-[38px]">
                New this <span className="italic">month</span>
              </h2>
            </div>
            <Link href="/diamonds?sort=newest" className="btn-link">
              View all
            </Link>
          </Reveal>
          <Suspense fallback={<div className="skeleton mt-6 h-80" />}>
            <NewArrivals />
          </Suspense>
        </div>
      </section>

      {/* 6. How it works + the 4 Cs */}
      <HowItWorks />

      {/* 7. Editorial photo banner */}
      <Reveal>
        <EditorialMonographBanner />
      </Reveal>

      {/* 8. Talk to a gemologist (with a travelling border beam) */}
      <GemologistConciergeBand />

      {/* 9. Client reviews */}
      <Reveal>
        <ClientReviews />
      </Reveal>

      {/* 10. Frequently asked questions */}
      <Reveal>
        <HomeFAQ />
      </Reveal>
    </>
  );
}

/** Newest diamonds from the live catalogue (streams in, so the page never waits for the API). */
async function NewArrivals() {
  const newest = await getNewArrivals(4);
  return (
    <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {newest.map((p, i) => (
        <li key={p.id}>
          <Reveal delay={i * 90} className="h-full">
            <ProductCard product={p} compact />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
