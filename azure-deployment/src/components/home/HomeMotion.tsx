"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { PRICE_BANDS, SHAPES } from "@/lib/catalog/labels";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Reveal: fades and un-blurs its children when they scroll into view
   (Magic UI "BlurFade" idea, no extra library). Styles live in globals.css (.reveal).
   ───────────────────────────────────────────────────────────── */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-shown={shown ? "true" : "false"} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SpotlightCard: a soft sand-coloured glow follows the cursor
   (Aceternity "card spotlight" idea). Styles in globals.css (.spotlight-card).
   ───────────────────────────────────────────────────────────── */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }
  return (
    <div onMouseMove={onMove} className={cn("spotlight-card", className)}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Find your diamond: one section with tabs (shape · size · budget)
   Replaces the separate "Choose your shape" and "Choose by size" sections.
   ───────────────────────────────────────────────────────────── */
const SHAPE_NOTES: Record<string, string> = {
  ROUND: "Most sparkle",
  OVAL: "Looks larger",
  PRINCESS: "Modern square",
  CUSHION: "Soft & romantic",
  EMERALD: "Clean step cut",
  PEAR: "Elegant teardrop",
  MARQUISE: "Long & slender",
  HEART: "Romantic",
  RADIANT: "Bright & bold",
  ASSCHER: "Art deco square",
};

const SIZES = [
  { title: "Under 1 carat", text: "Delicate and bright. Lovely for everyday solitaires.", href: "/diamonds?maxCarat=0.99", dot: "size-3" },
  { title: "1 to 2 carats", text: "Our most chosen size: a classic, balanced presence.", href: "/diamonds?minCarat=1&maxCarat=1.99", dot: "size-4", badge: "Most popular" },
  { title: "2 carats and above", text: "Statement stones with real presence on the hand.", href: "/diamonds?minCarat=2", dot: "size-6" },
];

type Tab = "shape" | "size" | "budget";
const TABS: { id: Tab; label: string }[] = [
  { id: "shape", label: "By shape" },
  { id: "size", label: "By size" },
  { id: "budget", label: "By budget" },
];

function budgetHref(min?: number, max?: number): string {
  const q = new URLSearchParams();
  if (min !== undefined) q.set("minPrice", String(min));
  if (max !== undefined) q.set("maxPrice", String(max));
  return `/diamonds?${q.toString()}`;
}

export function FindYourDiamond() {
  const [tab, setTab] = useState<Tab>("shape");

  return (
    <section aria-labelledby="find-heading" className="w-full border-b border-line bg-sand py-16 lg:py-20" id="shapes">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="section-eyebrow mb-2">Start here</span>
            <h2 id="find-heading" className="font-serif text-[36px] font-normal leading-tight text-ink sm:text-[42px]">
              Find your <span className="italic">diamond</span>
            </h2>
            <p className="mt-2 max-w-md text-[15px] text-slate">Begin with the shape you love, the size you have in mind, or your budget.</p>
          </div>

          {/* Segmented tabs (Origin UI / shadcn Tabs pattern) */}
          <div role="tablist" aria-label="Find your diamond by" className="inline-flex self-start rounded-full border border-line bg-white p-1 md:self-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`find-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`find-panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  tab === t.id ? "bg-ink text-white" : "text-slate hover:text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        {tab === "shape" && (
          <div role="tabpanel" id="find-panel-shape" aria-labelledby="find-tab-shape" className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
            {SHAPES.map((s, i) => (
              <Reveal key={s.value} delay={i * 40}>
                <Link
                  href={`/diamonds?shape=${s.value}`}
                  className="group flex min-h-[156px] flex-col items-center justify-between rounded-2xl border border-line bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-ink/40 hover:shadow-[0_12px_30px_-12px_rgba(43,45,49,0.20)]"
                >
                  <ShapeIcon shape={s.value} className="my-auto size-11 text-ink transition-transform duration-300 group-hover:scale-110" />
                  <span>
                    <span className="block font-serif text-[16px] text-ink">{s.label}</span>
                    <span className="mt-0.5 block text-[11px] text-slate">{SHAPE_NOTES[s.value] ?? ""}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {tab === "size" && (
          <div role="tabpanel" id="find-panel-size" aria-labelledby="find-tab-size" className="grid gap-4 md:grid-cols-3">
            {SIZES.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <SpotlightCard className="h-full rounded-3xl border border-line bg-white">
                  <Link href={t.href} className="group relative flex h-full min-h-[220px] flex-col justify-between p-7">
                    {t.badge && <span className="absolute right-5 top-5 rounded-full border border-line bg-sand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">{t.badge}</span>}
                    <span>
                      <span className="relative mb-6 grid size-16 place-items-center">
                        <span className="absolute inset-0 rounded-full border border-ink/10" />
                        <span className="absolute inset-3 rounded-full border border-ink/20" />
                        <span className={cn("rounded-full bg-ink transition-colors group-hover:bg-[var(--brand-accent)]", t.dot)} />
                      </span>
                      <span className="block font-serif text-[22px] text-ink">{t.title}</span>
                      <span className="mt-2 block text-[15px] leading-relaxed text-slate">{t.text}</span>
                    </span>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
                      Explore <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        )}

        {tab === "budget" && (
          <div role="tabpanel" id="find-panel-budget" aria-labelledby="find-tab-budget" className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {PRICE_BANDS.map((b, i) => (
              <Reveal key={b.label} delay={i * 60}>
                <Link
                  href={budgetHref(b.min, b.max)}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/40 hover:shadow-[0_12px_30px_-12px_rgba(43,45,49,0.20)]"
                >
                  <span className="font-serif text-[20px] leading-tight text-ink">{b.label}</span>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate group-hover:text-ink">
                    See diamonds <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/diamonds" className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-line-dark underline-offset-[6px] hover:decoration-ink">
            View all diamonds <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
