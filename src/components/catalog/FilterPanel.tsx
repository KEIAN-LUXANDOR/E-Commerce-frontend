"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { useListing } from "@/components/catalog/ListingState";
import {
  CARAT_BANDS,
  CLARITIES,
  COLORS,
  CUTS,
  FINISHES,
  FLUORESCENCES,
  LABS,
  PRICE_BANDS,
  SHAPES,
} from "@/lib/catalog/labels";
import { countActiveFilters } from "@/lib/catalog/query";
import type { ProductQuery } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/** Adds the value if missing, removes it if present. Returns undefined for an empty list. */
function toggle<T extends string>(list: T[] | undefined, value: T): T[] | undefined {
  const current = list ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  if (next.length === 0) return undefined;
  return next;
}

/** The shop's filters. Every click updates the address bar and the results. */
export function FilterPanel({ className }: { className?: string }) {
  const { query, update, originHref, fixedOrigin, clearAll } = useListing();
  const active = countActiveFilters(query);
  const origin = fixedOrigin ?? query.origin;

  return (
    <div className={cn("space-y-7", className)}>
      <Section title="Type">
        <ul className="border border-line text-sm">
          <OriginLink href={originHref(undefined)} label="All diamonds" active={!origin} />
          <OriginLink href={originHref("NATURAL")} label="Natural" active={origin === "NATURAL"} />
          <OriginLink href={originHref("LAB_GROWN")} label="Lab-grown" active={origin === "LAB_GROWN"} />
        </ul>
        <Link href="/education/natural-vs-lab" className="mt-2 inline-block text-sm text-slate underline-offset-4 hover:text-ink hover:underline">
          Natural or lab-grown?
        </Link>
      </Section>

      <Section title="Shape">
        <div className="grid grid-cols-5 gap-1.5">
          {SHAPES.map((s) => {
            const selected = query.shape?.includes(s.value) ?? false;
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ shape: toggle(query.shape, s.value) })}
                className={cn("flex flex-col items-center gap-1 border px-0.5 py-2 text-xs transition-colors", selected ? "border-ink bg-ink text-white" : "border-line bg-white text-slate hover:border-ink hover:text-ink")}
                title={s.label}
              >
                <ShapeIcon shape={s.value} className="size-7" />
                <span className="w-full truncate text-center">{s.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Carat (size)">
        <div className="flex flex-wrap gap-1.5">
          {CARAT_BANDS.map((b) => {
            const selected = query.minCarat === b.min && query.maxCarat === b.max;
            return (
              <button
                key={b.label}
                type="button"
                className="chip min-h-9 px-2.5"
                aria-pressed={selected}
                onClick={() => (selected ? update({ minCarat: undefined, maxCarat: undefined }) : update({ minCarat: b.min, maxCarat: b.max }))}
              >
                {b.label}
              </button>
            );
          })}
        </div>
        <RangeInputs
          key={`c-${query.minCarat}-${query.maxCarat}`}
          unit="ct"
          step="0.01"
          min={query.minCarat}
          max={query.maxCarat}
          onApply={(min, max) => update({ minCarat: min, maxCarat: max })}
        />
      </Section>

      <Section title="Price">
        <div className="flex flex-wrap gap-1.5">
          {PRICE_BANDS.map((b) => {
            const min = b.min === undefined ? undefined : b.min * 100;
            const max = b.max === undefined ? undefined : b.max * 100;
            const selected = query.minPrice === min && query.maxPrice === max;
            return (
              <button
                key={b.label}
                type="button"
                className="chip min-h-9 px-2.5"
                aria-pressed={selected}
                onClick={() => (selected ? update({ minPrice: undefined, maxPrice: undefined }) : update({ minPrice: min, maxPrice: max }))}
              >
                {b.label}
              </button>
            );
          })}
        </div>
        <RangeInputs
          key={`p-${query.minPrice}-${query.maxPrice}`}
          unit="₹"
          step="1000"
          min={query.minPrice === undefined ? undefined : query.minPrice / 100}
          max={query.maxPrice === undefined ? undefined : query.maxPrice / 100}
          onApply={(min, max) =>
            update({
              minPrice: min === undefined ? undefined : Math.round(min) * 100,
              maxPrice: max === undefined ? undefined : Math.round(max) * 100,
            })
          }
        />
        <p className="mt-2 text-sm text-slate">Prices include GST.</p>
      </Section>

      <Section title="Colour" hint="D is colourless. Each letter after it has a little more warmth.">
        <div className="grid grid-cols-5 gap-1.5">
          {COLORS.map((c) => (
            <button key={c.value} type="button" className="chip min-h-9 px-0" aria-pressed={query.color?.includes(c.value) ?? false} onClick={() => update({ color: toggle(query.color, c.value) })} title={c.group}>
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Clarity" hint="How clean the diamond is inside. FL is flawless; VS and above look clean to the eye.">
        <div className="grid grid-cols-4 gap-1.5">
          {CLARITIES.map((c) => (
            <button key={c.value} type="button" className="chip min-h-9 px-0" aria-pressed={query.clarity?.includes(c.value) ?? false} onClick={() => update({ clarity: toggle(query.clarity, c.value) })} title={c.meaning}>
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Cut" hint="Graded for round diamonds; most other shapes show “Not graded”.">
        <div className="flex flex-wrap gap-1.5">
          {CUTS.map((c) => (
            <button key={c.value} type="button" className="chip min-h-9 px-2.5" aria-pressed={query.cut?.includes(c.value) ?? false} onClick={() => update({ cut: toggle(query.cut, c.value) })}>
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      <MoreFilters query={query} update={update} />

      <Section title="Show only">
        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-ink" checked={Boolean(query.withImage)} onChange={(e) => update({ withImage: e.target.checked || undefined })} />
          Diamonds with photos
        </label>
        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-ink" checked={Boolean(query.quickShip)} onChange={(e) => update({ quickShip: e.target.checked || undefined })} />
          Ships fast
        </label>
      </Section>

      {active > 0 && (
        <button type="button" onClick={clearAll} className="btn btn-secondary w-full">
          <RotateCcw className="size-4" aria-hidden /> Clear all filters
        </button>
      )}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="section-eyebrow mb-3 text-ink">{title}</legend>
      {children}
      {hint && <p className="mt-2 text-sm leading-snug text-slate">{hint}</p>}
    </fieldset>
  );
}

function OriginLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li className="border-b border-line last:border-b-0">
      <Link href={href} aria-current={active ? "page" : undefined} className={cn("block px-3 py-2.5", active ? "bg-ink text-white" : "hover:bg-stone")} scroll={false}>
        {label}
      </Link>
    </li>
  );
}

/** Two number boxes (from / to) with an Apply button. Empty = no limit. */
function RangeInputs({ unit, step, min, max, onApply }: { unit: string; step: string; min?: number; max?: number; onApply: (min?: number, max?: number) => void }) {
  const [from, setFrom] = useState(min === undefined ? "" : String(min));
  const [to, setTo] = useState(max === undefined ? "" : String(max));
  const [error, setError] = useState<string>();

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const a = from.trim() === "" ? undefined : Number(from);
    const b = to.trim() === "" ? undefined : Number(to);
    if ((a !== undefined && (!Number.isFinite(a) || a < 0)) || (b !== undefined && (!Number.isFinite(b) || b < 0))) {
      setError("Enter numbers only.");
      return;
    }
    if (a !== undefined && b !== undefined && a > b) {
      setError("“From” must be smaller than “to”.");
      return;
    }
    setError(undefined);
    onApply(a, b);
  }

  return (
    <form onSubmit={apply} className="mt-3">
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">From ({unit})</span>
          <input inputMode="decimal" step={step} placeholder={`From ${unit}`} value={from} onChange={(e) => setFrom(e.target.value)} className="field min-h-10 px-2.5 text-sm" />
        </label>
        <span className="text-slate" aria-hidden>
          –
        </span>
        <label className="flex-1">
          <span className="sr-only">To ({unit})</span>
          <input inputMode="decimal" step={step} placeholder={`To ${unit}`} value={to} onChange={(e) => setTo(e.target.value)} className="field min-h-10 px-2.5 text-sm" />
        </label>
        <button type="submit" className="btn btn-secondary min-h-10 px-3 text-xs">
          Go
        </button>
      </div>
      {error && <p className="mt-1.5 text-sm text-out">{error}</p>}
    </form>
  );
}

/** Polish, symmetry, fluorescence and grading lab: folded away so the panel stays simple. */
function MoreFilters({ query, update }: { query: ProductQuery; update: (patch: Partial<ProductQuery>) => void }) {
  const used = [query.polish, query.symmetry, query.fluorescence, query.lab].filter((l) => l && l.length).length;
  const [open, setOpen] = useState(used > 0);
  return (
    <div className="border-t border-line pt-5">
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="section-eyebrow text-ink">
          More filters {used > 0 && <span className="normal-case tracking-normal text-slate">({used})</span>}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open ? "rotate-180" : "")} aria-hidden />
      </button>
      {open && (
        <div className="mt-5 space-y-6">
          <ChipGroup title="Polish" options={FINISHES} selected={query.polish} onToggle={(v) => update({ polish: toggle(query.polish, v) })} />
          <ChipGroup title="Symmetry" options={FINISHES} selected={query.symmetry} onToggle={(v) => update({ symmetry: toggle(query.symmetry, v) })} />
          <ChipGroup title="Fluorescence" options={FLUORESCENCES} selected={query.fluorescence} onToggle={(v) => update({ fluorescence: toggle(query.fluorescence, v) })} hint="A soft glow under UV light. None or faint is the safe choice." />
          <ChipGroup title="Grading lab" options={LABS} selected={query.lab} onToggle={(v) => update({ lab: toggle(query.lab, v) })} />
        </div>
      )}
    </div>
  );
}

function ChipGroup<T extends string>({ title, options, selected, onToggle, hint }: { title: string; options: { value: T; label: string }[]; selected?: T[]; onToggle: (v: T) => void; hint?: string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o.value} type="button" className="chip min-h-9 px-2.5" aria-pressed={selected?.includes(o.value) ?? false} onClick={() => onToggle(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className="mt-2 text-sm text-slate">{hint}</p>}
    </fieldset>
  );
}

