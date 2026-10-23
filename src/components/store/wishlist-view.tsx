"use client";

import * as React from "react";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useWishlist,
  toggleWishlist,
  addToCart,
  showToast,
} from "@/lib/stores";
import { diamonds } from "@/mocks/data";
import { formatRupees, formatRupeesPerCarat } from "@/lib/money";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import type { DiamondDetail } from "@/lib/types/catalog";

export function WishlistView() {
  const wishSlugs = useWishlist();

  const curatedDiamonds: DiamondDetail[] = useMemo(() => {
    const list: DiamondDetail[] = [];
    for (const slug of wishSlugs) {
      const match = diamonds.find((d) => d.slug === slug);
      if (match) {
        list.push(match);
      }
    }
    return list;
  }, [wishSlugs]);

  const handleMoveToCart = (diamond: DiamondDetail) => {
    const res = addToCart({
      diamondId: diamond.id,
      slug: diamond.slug,
      title: `${diamond.carat.toFixed(2)} ct ${diamond.shape} ${diamond.origin === "NATURAL" ? "Natural" : "Lab-Grown"}`,
      imageUrl: diamond.media[0]?.url,
      shape: diamond.shape,
      specLabel: `${diamond.color} / ${diamond.clarity} / ${diamond.cut} · ${diamond.lab} #${diamond.certificateNumber}`,
      certificateNumber: diamond.certificateNumber,
      pricePaise: diamond.pricePaise,
    });

    if (res === "already") {
      showToast("Diamond is already in your cart.", "info");
      return;
    }
    toggleWishlist(diamond.slug);
    showToast("Moved diamond from wishlist to cart.", "info");
  };

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Curated wishlist link copied to clipboard.", "info");
    }
  };

  const totalValuePaise = useMemo(() => {
    return curatedDiamonds.reduce((sum, d) => sum + d.pricePaise, 0);
  }, [curatedDiamonds]);

  if (curatedDiamonds.length === 0) {
    return (
      <div className="w-full bg-white text-[var(--color-ink)] py-20">
        <div className="page max-w-xl text-center">
          <div className="mx-auto size-16 rounded-full border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-slate)] mb-6">
            <Heart className="size-7" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)]">
            Your Wishlist is Empty
          </h1>
          <p className="mt-3 text-sm text-[var(--color-slate)] leading-relaxed">
            You have not saved any certified loose diamonds to your curation vault yet. Explore our natural and lab-grown inventory to bookmark stones for side-by-side evaluation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/diamonds/natural"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-[var(--color-ink)] px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[var(--color-loupe)] transition-colors"
            >
              Natural Diamonds
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/diamonds/lab-grown"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none border border-[var(--color-line)] bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
            >
              Lab-Grown Diamonds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-[var(--color-ink)]">
      {/* Header */}
      <section className="border-b border-[var(--color-line)] bg-white py-10">
        <div className="page">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">Wishlist</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-slate)]">
                Private Curation Vault
              </p>
              <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                Your curated <span className="italic">loose diamonds</span>
              </h1>
              <p className="mt-2 text-sm text-[var(--color-slate)] leading-relaxed">
                {curatedDiamonds.length} {curatedDiamonds.length === 1 ? "diamond" : "diamonds"} held for your personal inspection. Stones remain live in vault inventory until an insured order is completed.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleShareWishlist}
                className="inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              >
                <Share2 className="size-3.5" aria-hidden="true" />
                Share Curation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Curated Stones */}
      <section className="bg-[var(--color-stone)] py-12">
        <div className="page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {curatedDiamonds.map((diamond) => (
              <div
                key={diamond.id}
                className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-sm transition-all duration-200 hover:border-ink/40 hover:shadow-md"
              >
                <div>
                  {/* Top Bar with Lab Seal and Remove */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block rounded-full border border-line bg-stone px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-slate">
                      {diamond.lab} #{diamond.certificateNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(diamond.slug)}
                      className="text-muted hover:text-[var(--color-out)] transition-colors p-1"
                      aria-label={`Remove ${diamond.slug} from wishlist`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Diamond Specimen Image */}
                  <Link
                    href={`/diamonds/${diamond.origin === "NATURAL" ? "natural" : "lab-grown"}/${diamond.slug}`}
                    className="relative block aspect-square w-full overflow-hidden rounded-xl bg-stone/40 mb-4 group"
                  >
                    {diamond.media[0]?.url ? (
                      <Image
                        src={diamond.media[0].url}
                        alt={diamond.media[0].alt || `${diamond.carat} ct ${diamond.shape}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-muted">
                        {diamond.shape} Specimen
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 rounded-full border border-line bg-white/95 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-slate shadow-2xs">
                      {diamond.origin === "NATURAL" ? "Natural" : "Lab-Grown"}
                    </span>
                  </Link>

                  {/* Spec Details */}
                  <Link
                    href={`/diamonds/${diamond.origin === "NATURAL" ? "natural" : "lab-grown"}/${diamond.slug}`}
                    className="group"
                  >
                    <h2 className="font-serif text-xl font-medium group-hover:text-loupe transition-colors">
                      {diamond.carat.toFixed(2)} ct {diamond.shape}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate mt-1">
                    {diamond.color} Color · {diamond.clarity} Clarity · {diamond.cut} Cut
                  </p>

                  {/* Proportions micro strip */}
                  <div className="mt-3 grid grid-cols-3 gap-2 border-y border-line py-2 text-[11px] font-mono text-slate">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted block">Ratio</span>
                      <span>{diamond.lwRatio.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted block">Table</span>
                      <span>{diamond.tablePct.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted block">Depth</span>
                      <span>{diamond.depthPct.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4">
                    <p className="font-mono text-xl font-medium text-ink">
                      {formatRupees(diamond.pricePaise)}
                    </p>
                    <p className="font-mono text-[11px] text-muted mt-0.5">
                      {formatRupeesPerCarat(diamond.pricePaise, diamond.carat)} / ct
                    </p>
                  </div>
                </div>

                {/* Actions: Move to Cart & Inquire */}
                <div className="pt-6 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(diamond)}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-ink py-3 px-4 text-xs font-medium uppercase tracking-[0.08em] text-white hover:bg-loupe transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="size-3.5" aria-hidden="true" />
                    Move to Cart
                  </button>

                  <a
                    href={whatsappLink(`Hello Keian Luxandor, I am inquiring about this saved diamond from my wishlist: ${diamond.carat} ct ${diamond.shape} (${diamond.lab} #${diamond.certificateNumber}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-md border border-line bg-surface py-2.5 px-4 text-xs font-medium uppercase tracking-[0.06em] text-ink hover:bg-stone transition-colors"
                  >
                    <MessageCircle className="size-3.5 text-[#1f7a4d]" aria-hidden="true" />
                    Ask Gemologist on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Total Strip */}
          <div className="mt-10 rounded-2xl border border-line bg-surface p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-stone border border-line grid place-items-center text-loupe">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif text-base font-medium text-ink">
                  Total Curated Value: {formatRupees(totalValuePaise)}
                </p>
                <p className="text-xs text-slate">
                  All loose stones certified by GIA/IGI and shipped via fully insured armoured transit.
                </p>
              </div>
            </div>

            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-stone px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-ink hover:bg-stone-deep transition-colors shadow-2xs"
            >
              Open Comparison Matrix
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
