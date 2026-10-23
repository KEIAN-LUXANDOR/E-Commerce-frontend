"use client";

import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeroDiamond } from "@/components/home/HeroDiamond";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "@/lib/types/catalog";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  if (!banners.length) return null;
  const b = banners[index];
  const go = (d: number) => setIndex((i) => (i + d + banners.length) % banners.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured Collection"
      className="relative overflow-hidden border-b border-line bg-[var(--surface-warm)]"
    >
      <div className="page relative z-10 grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-20 lg:gap-16">
        <div key={b.id} aria-live="polite" aria-atomic="true" className="order-2 animate-fade-up md:order-1">
          <div role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${banners.length}`}>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="cert" className="text-[11px] px-3 py-1 shadow-2xs">
                <Sparkles className="size-3 mr-1 text-loupe" />
                Pure Loose Solitaires
              </Badge>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate">
                GIA &amp; IGI Inscribed
              </span>
            </div>

            <h1 className="font-editorial text-[2.75rem] sm:text-5xl lg:text-6xl font-medium tracking-tight text-ink leading-[1.05] text-balance">
              {b.title}
            </h1>

            <p className="mt-5 max-w-[48ch] text-base sm:text-lg text-slate leading-relaxed">
              {b.text}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={b.ctaHref}>
                <span className="btn btn-primary rounded-sm px-7 py-3.5">
                  {b.ctaLabel}
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
              <Link
                href="/education/shapes"
                className="inline-flex items-center justify-center rounded-sm border border-line-dark bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink"
              >
                Shape Metrology Guide
              </Link>
            </div>
          </div>

          {banners.length > 1 && (
            <div className="mt-12 flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-10 place-items-center rounded-full border border-line bg-surface hover:border-ink hover:shadow-xs transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4 text-ink" aria-hidden />
              </button>
              <ol className="flex items-center gap-2">
                {banners.map((x, i) => (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show slide ${i + 1}: ${x.title}`}
                      aria-current={i === index}
                      className={`block rounded-full transition-all duration-300 ${
                        i === index ? "size-3 bg-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]/25" : "size-2 bg-line-dark hover:bg-[var(--brand-accent)]"
                      }`}
                    />
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-10 place-items-center rounded-full border border-line bg-surface hover:border-ink hover:shadow-xs transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4 text-ink" aria-hidden />
              </button>
            </div>
          )}
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          {b.imageUrl ? (
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-none border border-line bg-[#F8FAFC]">
              <Image
                src={b.imageUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="banner-slot relative aspect-square w-full max-w-[480px] border border-line p-8 flex items-center justify-center select-none">
              {/* Subtle architectural specimen drafting overlay */}
              <div className="absolute top-4 left-4 text-[11px] font-mono tracking-wider text-slate uppercase">
                SPECIMEN REF. KL-9041 · 1.51 CT
              </div>
              <div className="absolute bottom-4 right-4 text-[11px] font-mono tracking-wider text-slate uppercase">
                TRIPLE EXCELLENT · GIA
              </div>

              {/* Star facet fire sparkles */}
              <svg className="absolute top-1/4 right-1/4 w-5 h-5 text-[#B3A8F4] opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
              </svg>
              <svg className="absolute bottom-1/4 left-1/4 w-4 h-4 text-[#7FD3F2] opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
              </svg>
              <svg className="absolute top-1/3 left-1/3 w-3.5 h-3.5 text-[#F2A9C9] opacity-75" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
              </svg>

              <div className="relative z-10 w-full flex items-center justify-center">
                <HeroDiamond shape={b.shape ?? "ROUND"} />
              </div>
              <span className="absolute bottom-4 left-4 z-10 bg-white/85 px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-slate">
                Certified diamond imagery
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
