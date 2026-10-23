"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useCompare,
  removeFromCompare,
  clearCompare,
  addToCart,
  showToast,
} from "@/lib/stores";
import { diamonds } from "@/mocks/data";
import { formatRupees, formatRupeesPerCarat } from "@/lib/money";
import {
  Scale,
  X,
  Plus,
  ExternalLink,
  ShoppingBag,
  MessageCircle,
  Check,
} from "lucide-react";
import { whatsappLink } from "@/lib/site";
import type { DiamondDetail } from "@/lib/types/catalog";

export function DiamondComparison() {
  const compareSlugs = useCompare();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  // Map slugs to full diamond records from mocks or active data
  const selectedDiamonds: DiamondDetail[] = useMemo(() => {
    const list: DiamondDetail[] = [];
    for (const slug of compareSlugs) {
      const match = diamonds.find((d) => d.slug === slug);
      if (match) {
        list.push(match);
      }
    }
    return list;
  }, [compareSlugs]);

  const maxSlots = 4;
  const emptySlotsCount = Math.max(0, maxSlots - selectedDiamonds.length);

  const handleAddToCart = (diamond: DiamondDetail) => {
    const result = addToCart({
      diamondId: diamond.id,
      slug: diamond.slug,
      title: `${diamond.carat.toFixed(2)} ct ${diamond.shape} ${diamond.origin === "NATURAL" ? "Natural" : "Lab-Grown"}`,
      imageUrl: diamond.media[0]?.url,
      shape: diamond.shape,
      specLabel: `${diamond.color} / ${diamond.clarity} / ${diamond.cut} · ${diamond.lab} #${diamond.certificateNumber}`,
      certificateNumber: diamond.certificateNumber,
      pricePaise: diamond.pricePaise,
    });

    if (result === "already") {
      showToast("Diamond is already reserved in your cart.", "info");
      return;
    }
    showToast("Diamond added to your shopping cart.", "info");
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    for (const d of selectedDiamonds) {
      const res = addToCart({
        diamondId: d.id,
        slug: d.slug,
        title: `${d.carat.toFixed(2)} ct ${d.shape} ${d.origin === "NATURAL" ? "Natural" : "Lab-Grown"}`,
        imageUrl: d.media[0]?.url,
        shape: d.shape,
        specLabel: `${d.color} / ${d.clarity} / ${d.cut} · ${d.lab} #${d.certificateNumber}`,
        certificateNumber: d.certificateNumber,
        pricePaise: d.pricePaise,
      });
      if (res === "added") {
        addedCount++;
      }
    }

    if (addedCount > 0) {
      showToast(`Added ${addedCount} diamonds to your cart.`, "info");
    } else {
      showToast("All selected diamonds are already in your cart.", "info");
    }
  };

  // Helper to determine if values differ across selected diamonds
  const isDifferent = (extractor: (d: DiamondDetail) => string | number | undefined) => {
    if (selectedDiamonds.length <= 1) return false;
    const first = extractor(selectedDiamonds[0]);
    return selectedDiamonds.some((d) => extractor(d) !== first);
  };

  // Total combined value in Paise
  const totalCombinedPaise = useMemo(() => {
    return selectedDiamonds.reduce((sum, d) => sum + d.pricePaise, 0);
  }, [selectedDiamonds]);

  // WhatsApp concierge inquiry string
  const whatsappInquiryMessage = useMemo(() => {
    const certList = selectedDiamonds.map((d) => `${d.carat}ct ${d.shape} (${d.lab} #${d.certificateNumber})`).join(", ");
    return `Hello Keian Luxandor, I am comparing these certified diamonds on your portal: ${certList}. Could you provide expert advice on their optical performance?`;
  }, [selectedDiamonds]);

  return (
    <div className="w-full bg-white text-[var(--color-ink)]">
      {/* Top Header Bar */}
      <section className="border-b border-[var(--color-line)] bg-white py-10">
        <div className="page">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--color-ink)] transition-colors">
              Diamonds
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">Compare</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-slate)]">
                Comparative Analytical Ledger
              </p>
              <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                Compare certified <span className="italic">diamonds</span>
              </h1>
              <p className="mt-2 text-sm text-[var(--color-slate)] leading-relaxed">
                Compare up to 4 loose stones side by side on cut metrology, proportions, and certificate records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Show only differences Toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDifferences}
                  onChange={(e) => setOnlyDifferences(e.target.checked)}
                  className="size-4 rounded-none border-[var(--color-line-dark)] accent-[var(--color-ink)] focus:ring-0"
                />
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)]">
                  Show only differences
                </span>
              </label>

              <span className="text-[var(--color-line)] hidden sm:inline">|</span>

              {/* Clear All */}
              <button
                type="button"
                onClick={clearCompare}
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-slate)] hover:text-[var(--color-out)] transition-colors"
              >
                <X className="size-3.5" aria-hidden="true" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Specimen Arena */}
      <section className="bg-[var(--color-stone)] py-10">
        <div className="page">
          <div className="overflow-x-auto border border-[var(--color-line)] bg-white shadow-none">
            {/* Specimen Header Grid (4 Columns) */}
            <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)]">
              {selectedDiamonds.map((diamond) => (
                <div key={diamond.id} className="flex flex-col justify-between p-6 bg-white">
                  <div>
                    {/* Top strip with Cert badge and Remove trigger */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-block border border-[var(--color-line)] bg-[var(--color-stone)] px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-[var(--color-slate)]">
                        {diamond.lab} #{diamond.certificateNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(diamond.slug)}
                        className="text-xs text-[var(--color-muted)] hover:text-[var(--color-out)] transition-colors"
                        aria-label={`Remove ${diamond.slug} from comparison`}
                      >
                        Remove ×
                      </button>
                    </div>

                    {/* Diamond Specimen Photo */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-stone)] flex items-center justify-center mb-4">
                      {diamond.media[0]?.url ? (
                        <Image
                          src={diamond.media[0].url}
                          alt={diamond.media[0].alt || `${diamond.carat} ct ${diamond.shape} Diamond`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="grid place-items-center text-xs text-[var(--color-muted)] uppercase tracking-wider">
                          {diamond.shape} Specimen
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest text-[var(--color-slate)] border border-[var(--color-line)]">
                        {diamond.origin === "NATURAL" ? "Earth-Mined" : "Lab-Created"}
                      </span>
                    </div>

                    {/* Specimen Nomenclature */}
                    <Link
                      href={`/diamonds/${diamond.origin === "NATURAL" ? "natural" : "lab-grown"}/${diamond.slug}`}
                      className="group"
                    >
                      <h2 className="font-serif text-lg font-medium leading-snug group-hover:text-[var(--color-loupe)] transition-colors">
                        {diamond.carat.toFixed(2)} ct {diamond.shape}
                      </h2>
                    </Link>
                    <p className="text-xs text-[var(--color-slate)] mt-0.5">
                      {diamond.origin === "NATURAL" ? "Natural Diamond" : "Lab-Grown Diamond"}
                    </p>

                    {/* Pricing */}
                    <div className="mt-3">
                      <p className="text-lg font-medium font-mono text-[var(--color-ink)]">
                        {formatRupees(diamond.pricePaise)}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)] font-mono mt-0.5">
                        {formatRupeesPerCarat(diamond.pricePaise, diamond.carat)} / ct
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(diamond)}
                      className="w-full flex items-center justify-center gap-2 rounded-none bg-[var(--color-ink)] py-3 px-4 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[var(--color-loupe)] transition-colors"
                    >
                      <ShoppingBag className="size-3.5" aria-hidden="true" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty Available Comparison Slots */}
              {Array.from({ length: emptySlotsCount }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex flex-col items-center justify-center p-8 text-center bg-[var(--color-stone)]/40 border-dashed"
                >
                  <div className="size-12 rounded-full border border-[var(--color-line)] bg-white grid place-items-center text-[var(--color-slate)] mb-3">
                    <Plus className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-[var(--color-ink)]">
                    Slot {selectedDiamonds.length + index + 1} Available
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-slate)] max-w-[200px] leading-relaxed">
                    Select another diamond to compare cut metrology side by side.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-block border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
                  >
                    Browse Diamonds
                  </Link>
                </div>
              ))}
            </div>

            {/* Section 1: Key Gemological Grades */}
            {(!onlyDifferences || isDifferent((d) => d.pricePaise / d.carat)) && (
              <>
                <div className="min-w-[900px] border-b border-[var(--color-line)] bg-[var(--color-stone)] px-6 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                    1. Key Gemological Grades
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                    GIA / IGI Forensic Grading
                  </span>
                </div>

                {/* Price per carat row */}
                <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                  {selectedDiamonds.map((d) => (
                    <div key={`ppc-${d.id}`} className="pr-4">
                      <span className="text-[11px] text-[var(--color-muted)] block">Price per Carat</span>
                      <span className="font-mono font-medium text-sm text-[var(--color-ink)] mt-0.5 block">
                        {formatRupeesPerCarat(d.pricePaise, d.carat)}
                      </span>
                    </div>
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, i) => (
                    <div key={`ppc-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                  ))}
                </div>
              </>
            )}

            {/* Origin & Laboratory */}
            {(!onlyDifferences || isDifferent((d) => `${d.origin}-${d.lab}`)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`orig-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Origin &amp; Laboratory</span>
                    <span className="font-medium text-[var(--color-ink)] mt-0.5 block">
                      {d.origin === "NATURAL" ? "Earth-Mined" : "Lab-Grown"} · {d.lab}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`orig-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Carat Weight */}
            {(!onlyDifferences || isDifferent((d) => d.carat)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`carat-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Carat Weight</span>
                    <span className="font-mono font-medium text-sm text-[var(--color-ink)] mt-0.5 block">
                      {d.carat.toFixed(2)} ct
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`carat-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Colour Grade */}
            {(!onlyDifferences || isDifferent((d) => d.color)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`col-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Colour Grade</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-sm text-[var(--color-ink)]">{d.color}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-slate)]">
                        {d.color === "D" || d.color === "E" || d.color === "F" ? "(Colorless)" : "(Near Colorless)"}
                      </span>
                    </div>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`col-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Clarity Grade */}
            {(!onlyDifferences || isDifferent((d) => d.clarity)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`clar-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Clarity Grade</span>
                    <span className="font-mono font-medium text-sm text-[var(--color-ink)] mt-0.5 block">
                      {d.clarity}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`clar-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Cut Grade */}
            {(!onlyDifferences || isDifferent((d) => d.cut)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`cut-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Cut Grade</span>
                    <span className="font-medium text-[var(--color-ink)] mt-0.5 block">
                      {d.cut}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`cut-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Section 2: Proportions & Metrology */}
            <div className="min-w-[900px] border-b border-[var(--color-line)] bg-[var(--color-stone)] px-6 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                2. Proportions &amp; Metrology
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                Laser Micrometer Measurements
              </span>
            </div>

            {/* Measurements mm */}
            {(!onlyDifferences || isDifferent((d) => `${d.measurements.lengthMm}x${d.measurements.widthMm}x${d.measurements.depthMm}`)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`meas-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Measurements (L × W × D)</span>
                    <span className="font-mono text-[var(--color-ink)] mt-0.5 block">
                      {d.measurements.lengthMm.toFixed(2)} × {d.measurements.widthMm.toFixed(2)} × {d.measurements.depthMm.toFixed(2)} mm
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`meas-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Ratio */}
            {(!onlyDifferences || isDifferent((d) => d.lwRatio)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`ratio-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Length-to-Width Ratio</span>
                    <span className="font-mono font-medium text-[var(--color-ink)] mt-0.5 block">
                      {d.lwRatio.toFixed(2)}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`ratio-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Table % */}
            {(!onlyDifferences || isDifferent((d) => d.tablePct)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`tab-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Table %</span>
                    <span className="font-mono text-[var(--color-ink)] mt-0.5 block">
                      {d.tablePct.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`tab-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Depth % */}
            {(!onlyDifferences || isDifferent((d) => d.depthPct)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`dep-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Depth %</span>
                    <span className="font-mono text-[var(--color-ink)] mt-0.5 block">
                      {d.depthPct.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`dep-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Girdle & Culet */}
            {(!onlyDifferences || isDifferent((d) => `${d.girdle}-${d.culet}`)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`gc-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Girdle / Culet</span>
                    <span className="text-[var(--color-ink)] mt-0.5 block">
                      {d.girdle} · {d.culet}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`gc-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Section 3: Polish, Symmetry & Laboratory Record */}
            <div className="min-w-[900px] border-b border-[var(--color-line)] bg-[var(--color-stone)] px-6 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                3. Polish, Symmetry &amp; Laboratory Record
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                Direct Lab Registry Authentication
              </span>
            </div>

            {/* Polish & Symmetry */}
            {(!onlyDifferences || isDifferent((d) => `${d.polish}-${d.symmetry}`)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`polsym-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Polish &amp; Symmetry</span>
                    <span className="font-medium text-[var(--color-ink)] mt-0.5 block">
                      {d.polish} / {d.symmetry}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`polsym-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Fluorescence */}
            {(!onlyDifferences || isDifferent((d) => d.fluorescence)) && (
              <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] border-b border-[var(--color-line)] px-6 py-3 bg-white text-xs items-center">
                {selectedDiamonds.map((d) => (
                  <div key={`fluor-${d.id}`} className="pr-4">
                    <span className="text-[11px] text-[var(--color-muted)] block">Fluorescence</span>
                    <span className="text-[var(--color-ink)] mt-0.5 block">
                      {d.fluorescence}
                    </span>
                  </div>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div key={`fluor-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
                ))}
              </div>
            )}

            {/* Laboratory Report & Direct Link */}
            <div className="grid min-w-[900px] grid-cols-4 divide-x divide-[var(--color-line)] px-6 py-4 bg-white text-xs items-start">
              {selectedDiamonds.map((d) => (
                <div key={`rep-${d.id}`} className="pr-4 space-y-1">
                  <span className="text-[11px] text-[var(--color-muted)] block">Laboratory Report</span>
                  <span className="font-mono font-medium text-[var(--color-ink)] block">
                    {d.lab} #{d.certificateNumber}
                  </span>
                  <a
                    href={d.certificateUrl ?? (d.lab === "GIA" ? `https://www.gia.edu/report-check?reportno=${d.certificateNumber}` : `https://www.igi.org/verify-your-report/?r=${d.certificateNumber}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-loupe)] hover:underline pt-1"
                  >
                    Verify on {d.lab === "GIA" ? "gia.edu" : "igi.org"}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </div>
              ))}
              {Array.from({ length: emptySlotsCount }).map((_, i) => (
                <div key={`rep-empty-${i}`} className="text-[var(--color-muted)]/40 px-4">—</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Summary Action Tray */}
      {selectedDiamonds.length > 0 && (
        <section className="sticky bottom-0 z-20 border-t border-[var(--color-line)] bg-white/95 backdrop-blur-md py-4">
          <div className="page flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-[var(--color-stone)] border border-[var(--color-line)] grid place-items-center text-[var(--color-ink)]">
                <Scale className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif text-base font-medium text-[var(--color-ink)]">
                  {selectedDiamonds.length} {selectedDiamonds.length === 1 ? "stone" : "stones"} selected for evaluation
                </p>
                <p className="text-xs text-[var(--color-slate)] font-mono">
                  Combined Total: {formatRupees(totalCombinedPaise)} · Fully Insured Delivery
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-none bg-[var(--color-ink)] px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[var(--color-loupe)] transition-colors"
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
                Add All to Cart
              </button>

              <a
                href={whatsappLink(whatsappInquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-none border border-[var(--color-line)] bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              >
                <MessageCircle className="size-4 text-[#1f7a4d]" aria-hidden="true" />
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
