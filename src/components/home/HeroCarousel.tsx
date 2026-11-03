"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import type { Banner } from "@/lib/types/catalog";

/**
 * Locally hosted hero films. Keep these files in the frontend's public directory;
 * Next.js serves them from the site root (for example, /D-55973.mp4).
 */



const HERO_VISUALS = [
  {
    src: "/D-55973.mp4",
    label: "The loose stone",
    caption: "Every cut has its own character.",
    position: "center 80%",
  },
  {
    src: "/SDS-35.mp4",
    label: "The solitaire",
    caption: "Made to feel like it was always yours.",
    position: "center 50%",
  },
  {
    src: "/IMG_0374.MOV",
    label: "Under the loupe",
    caption: "Step cuts reward a closer look.",
    position: "center 50%",
  },
];

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  if (!banners.length) return null;

  const banner = banners[index];
  const visual = HERO_VISUALS[index % HERO_VISUALS.length];

  const go = (direction: number) => {
    setIndex((current) => (current + direction + banners.length) % banners.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured diamond collections"
      className="relative isolate overflow-hidden border-b border-line bg-sand"
    >
      <Spotlight
        className="-top-48 left-0 opacity-60 md:-top-36 md:left-40"
        fill="rgba(220, 203, 168, 0.42)"
      />

      <div className="page relative z-10 grid items-center gap-9 py-9 sm:gap-11 sm:py-12 md:grid-cols-[0.94fr_1.06fr] md:gap-12 md:py-14 lg:gap-16 lg:py-[4.5rem]">
        <div
          key={banner.id}
          aria-live="polite"
          aria-atomic="true"
          className="order-2 animate-fade-up md:order-1"
        >
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${banners.length}`}
          >
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-anchor">
                <span className="size-1.5 rounded-full bg-bronze" aria-hidden="true" />
                Keian Luxandor · Diamond atelier
              </span>
              <span className="hidden h-3.5 w-px bg-line-dark sm:block" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate">
                GIA &amp; IGI certified
              </span>
            </div>

            <h1 className="max-w-[12ch] font-editorial text-[clamp(2.8rem,5.5vw,5rem)] font-normal leading-[0.96] tracking-[-0.035em] text-ink text-balance">
              {banner.title}
            </h1>

            <p className="mt-5 max-w-[47ch] text-[15px] leading-[1.85] text-ink/70 sm:text-base">
              {banner.text}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
              <Link
                href={banner.ctaHref}
                className="btn btn-primary inline-flex min-h-12 items-center gap-3 rounded-full px-7 py-3.5 text-[11px] tracking-[0.14em] shadow-[0_12px_24px_-18px_rgba(31,58,50,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(31,58,50,0.75)]"
              >
                {banner.ctaLabel}
                <ArrowUpRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </Link>

              <Link
                href="/education/shapes"
                className="group inline-flex items-center gap-2 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/75 transition-colors hover:text-brand-anchor"
              >
                Find your shape
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-slate">
              <span className="font-medium text-ink/75">Natural &amp; lab-grown</span>
              <span className="size-1 rounded-full bg-bronze/70" aria-hidden="true" />
              <span>Selected with care</span>
            </div>
          </div>

          {banners.length > 1 && (
            <div className="mt-9 flex items-center gap-4 border-t border-line-dark/70 pt-5">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line-dark bg-white/70 text-ink transition-all hover:border-brand-anchor/50 hover:bg-white hover:text-brand-anchor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-anchor/30"
                aria-label="Previous featured collection"
              >
                <ChevronLeft className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </button>

              <ol className="flex items-center gap-1.5" aria-label="Choose a featured collection">
                {banners.map((item, itemIndex) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(itemIndex)}
                      aria-label={`Show collection ${itemIndex + 1}: ${item.title}`}
                      aria-current={itemIndex === index ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-anchor/35 focus-visible:ring-offset-2 ${
                        itemIndex === index
                          ? "w-8 bg-brand-anchor"
                          : "w-3 bg-line-dark hover:bg-brand-anchor/55"
                      }`}
                    />
                  </li>
                ))}
              </ol>

              <span className="ml-1 whitespace-nowrap font-mono text-[10px] tracking-[0.12em] text-slate">
                {String(index + 1).padStart(2, "0")}
                <span className="px-1.5 text-line-strong">/</span>
                {String(banners.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line-dark bg-white/70 text-ink transition-all hover:border-brand-anchor/50 hover:bg-white hover:text-brand-anchor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-anchor/30"
                aria-label="Next featured collection"
              >
                <ChevronRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <figure className="relative w-full max-w-[35rem]">
            <div
              key={`${banner.id}-film`}
              className="relative aspect-[5/4] overflow-hidden rounded-[1.65rem] border border-white/80 bg-[#202722] shadow-[0_28px_72px_-35px_rgba(31,45,37,0.5)] sm:rounded-[2rem]"
            >
              <video
                key={visual.src}
                src={visual.src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover"
                style={{ objectPosition: visual.position }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,20,16,0.10)_0%,rgba(13,20,16,0.02)_42%,rgba(13,20,16,0.72)_100%)]"
              />
              <div className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-white/20 sm:inset-4 sm:rounded-[1.5rem]" />

              <figcaption className="absolute inset-x-0 bottom-0 px-7 pb-7 pt-20 text-white sm:px-9 sm:pb-9">
                <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.2em] text-white/70">
                  {visual.label}
                </span>
                <p className="max-w-[18ch] font-editorial text-[1.8rem] leading-[1.05] sm:text-[2.15rem]">
                  {visual.caption}
                </p>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
