import { HeroCarousel } from "@/components/home/HeroCarousel";
import { EditorialMonographBanner } from "@/components/home/EditorialMonographBanner";
import { EditorialPhotoshootStrip } from "@/components/home/EditorialPhotoshootStrip";
import {
  StatStrip,
  ShopByShape,
  OriginCompare,
  ChooseBySize,
  HowItWorks,
  GradesMadeSimple,
  ClientReviews,
  GemologistConciergeBand,
  HomeFAQ,
} from "@/components/home/HomeSections";
import { ProductRow } from "@/components/store/ProductRow";
import { getStoreCategories, getStoreProducts } from "@/lib/api/store";
import type { Banner } from "@/lib/types/catalog";
import type { StoreCategory } from "@/lib/types/store";

/** Finds the category whose name or slug contains a word, e.g. "lab" → Lab-grown diamonds. */
function categoryHref(categories: StoreCategory[], word: string, fallback: string) {
  const c = categories.find((x) => `${x.slug} ${x.name}`.toLowerCase().includes(word));
  if (c) {
    return `/shop/${encodeURIComponent(c.slug)}`;
  }
  return fallback;
}

/**
 * Modern Human-Centric Diamond Atelier Home Page.
 * Strictly aligned with Stitch Calm Editorial Luxury cadence:
 * 1. Hero with architectural specimen drafting overlay & star facet fire
 * 2. Stat Strip (GIA & IGI, 30-day returns, insured delivery, Surat precision atelier)
 * 3. Choose your shape (10 shape tiles in #F6F4EF stone band)
 * 4. Natural or Lab-grown (geological origin vs modern science)
 * 5. New this month (clean diamond specimen cards)
 * 6. Choose by size (proportions tier cards: Under 1ct, 1-2ct, 2ct+)
 * 7. How it works (4 numbered steps)
 * 8. Grades made simple (Carat, Colour, Clarity, Cut)
 * 9. Editorial Monograph Photoshoot Banner
 * 10. Surat Precision Atelier & 40x Loupe Video Consultation
 * 11. Client Testimonials
 * 12. Frequently Asked Questions (accordions)
 */
export default async function HomePage() {
  const [categories, newest] = await Promise.all([
    getStoreCategories(),
    getStoreProducts({ sort: "newest", page: 0, size: 4 }),
  ]);
  const naturalHref = categoryHref(categories, "natural", "/shop?q=natural");
  const labHref = categoryHref(categories, "lab", "/shop?q=lab");

  const banners: Banner[] = [
    {
      id: "b1",
      title: "Every diamond, certified and inspected.",
      text: "Natural diamonds graded by GIA and lab-grown diamonds graded by IGI. Clear grades, honest prices, insured delivery across India.",
      ctaLabel: "Shop Diamonds",
      ctaHref: "/shop",
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
      ctaHref: "/shop?q=emerald",
      shape: "EMERALD",
      startsAt: "",
      endsAt: "",
    },
  ];

  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel banners={banners} />

      {/* 2. Stat Strip */}
      <StatStrip />

      {/* 3. Choose Your Shape */}
      <ShopByShape />

      {/* 4. Natural or Lab-Grown */}
      <OriginCompare naturalHref={naturalHref} labHref={labHref} />

      {/* 5. New This Month */}
      <section className="w-full bg-white border-b border-line py-16 lg:py-20" id="new-month">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ProductRow
            id="new"
            title="New this month"
            products={newest.items}
            link={{ href: "/shop?sort=newest", label: "VIEW ALL" }}
          />
        </div>
      </section>

      {/* 6. Choose by Size */}
      <ChooseBySize />

      {/* 7. How It Works */}
      <HowItWorks />

      {/* 8. Grades Made Simple */}
      <GradesMadeSimple />

      {/* 9. Atelier editorial photography */}
      <EditorialPhotoshootStrip />

      {/* 10. Editorial Monograph Banner */}
      <EditorialMonographBanner />

      {/* 11. Surat Precision Atelier & 40x Loupe Video Consultation */}
      <GemologistConciergeBand />

      {/* 12. Verified Collector Testimonials */}
      <ClientReviews />

      {/* 13. Frequently Asked Questions */}
      <HomeFAQ />
    </>
  );
}
