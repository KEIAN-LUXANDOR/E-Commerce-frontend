"use client";

import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { CLARITIES, COLORS, CUTS, FLUORESCENCES, LABS, ORIGINS, SHAPES } from "@/lib/catalog-labels";
import { CARAT_BOUNDS, PRICE_BOUNDS, toggleValue } from "@/lib/filters";
import type { ProductFilters } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

interface Props {
  value: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  /** Hide filters already fixed by the page, e.g. origin on /shop/natural */
  hide?: (keyof ProductFilters)[];
}

const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: "Under ₹1L", max: 100000 },
  { label: "₹1–3L", min: 100000, max: 300000 },
  { label: "₹3–6L", min: 300000, max: 600000 },
  { label: "₹6–15L", min: 600000, max: 1500000 },
  { label: ">₹15L", min: 1500000 },
];

/** All filter groups. Used in the desktop sidebar and inside the mobile drawer. */
export function FilterControls({ value, onChange, hide = [] }: Props) {
  const shown = (k: keyof ProductFilters) => !hide.includes(k);

  return (
    <div className="divide-y divide-[var(--color-line)]">
      {shown("shape") && (
        <Group title="Geometric Shape" count={value.shape?.length}>
          <ul className="grid grid-cols-5 gap-1.5">
            {SHAPES.map((s) => {
              const on = value.shape?.includes(s.value) ?? false;
              return (
                <li key={s.value}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => onChange({ shape: toggleValue(value.shape, s.value) })}
                    className={cn(
                      "flex w-full flex-col items-center gap-1.5 border p-2 text-[10px] uppercase font-mono tracking-wider transition-all rounded-none",
                      on
                        ? "border-[var(--canvas-dark,#0D0D0D)] bg-[#F6F4EF] text-[var(--color-ink)] font-bold ring-1 ring-[var(--brand-accent,#D4AF37)] shadow-2xs"
                        : "border-[var(--color-line)] bg-white hover:border-[var(--color-ink)] text-[var(--color-slate)]"
                    )}
                  >
                    <ShapeIcon shape={s.value} className={cn("size-6", on ? "text-[var(--color-ink)]" : "text-[var(--color-slate)]")} />
                    <span className="truncate w-full text-center">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>
      )}

      {shown("caratMin") && (
        <Group title="Carat Weight" count={value.caratMin !== undefined || value.caratMax !== undefined ? 1 : 0}>
          <RangeField
            key={`${value.caratMin}-${value.caratMax}`}
            label="carat"
            min={CARAT_BOUNDS.min}
            max={CARAT_BOUNDS.max}
            step={0.05}
            from={value.caratMin}
            to={value.caratMax}
            format={(n) => `${n.toFixed(2)} ct`}
            onCommit={(a, b) => onChange({ caratMin: a, caratMax: b })}
          />
        </Group>
      )}

      {shown("priceMin") && (
        <Group title="Acquisition Price" count={value.priceMin !== undefined || value.priceMax !== undefined ? 1 : 0}>
          <ul className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((p) => {
              const on = value.priceMin === p.min && value.priceMax === p.max;
              return (
                <li key={p.label}>
                  <Pill on={on} onClick={() => onChange(on ? { priceMin: undefined, priceMax: undefined } : { priceMin: p.min, priceMax: p.max })}>
                    {p.label}
                  </Pill>
                </li>
              );
            })}
          </ul>
          <PriceInputs key={`${value.priceMin}-${value.priceMax}`} from={value.priceMin} to={value.priceMax} onCommit={(a, b) => onChange({ priceMin: a, priceMax: b })} />
        </Group>
      )}

      {shown("origin") && (
        <Group title="Inventory Origin" count={value.origin?.length}>
          <Checks options={ORIGINS} selected={value.origin} onToggle={(v) => onChange({ origin: toggleValue(value.origin, v) })} />
        </Group>
      )}

      {shown("color") && (
        <Group title="Colour Grade" hint="D is pure colourless; grades toward K exhibit subtle warmth." count={value.color?.length}>
          <Scale options={COLORS} selected={value.color} onToggle={(v) => onChange({ color: toggleValue(value.color, v) })} />
        </Group>
      )}

      {shown("clarity") && (
        <Group title="Clarity Grade" hint="FL/IF is flawless; VS/SI stones feature slight microscopic inclusions." count={value.clarity?.length}>
          <Scale columns={4} options={CLARITIES} selected={value.clarity} onToggle={(v) => onChange({ clarity: toggleValue(value.clarity, v) })} />
        </Group>
      )}

      {shown("cut") && (
        <Group title="Cut Grade" count={value.cut?.length} defaultOpen={false}>
          <Checks options={CUTS} selected={value.cut} onToggle={(v) => onChange({ cut: toggleValue(value.cut, v) })} />
        </Group>
      )}

      {shown("fluorescence") && (
        <Group title="Fluorescence" hint="Reaction under UV light. None or Faint is standard archival recommendation." count={value.fluorescence?.length} defaultOpen={false}>
          <Checks options={FLUORESCENCES} selected={value.fluorescence} onToggle={(v) => onChange({ fluorescence: toggleValue(value.fluorescence, v) })} />
        </Group>
      )}

      {shown("lab") && (
        <Group title="Laboratory Certificate" count={value.lab?.length} defaultOpen={false}>
          <Checks options={LABS} selected={value.lab} onToggle={(v) => onChange({ lab: toggleValue(value.lab, v) })} />
        </Group>
      )}
    </div>
  );
}

function Group({
  title,
  hint,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  hint?: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen || !!count} className="group py-4 first:pt-0 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] font-semibold select-none">
        <span>
          {title}
          {!!count && <span className="ml-2 font-mono text-[11px] text-[var(--brand-accent,#D4AF37)] font-bold">[{count}]</span>}
        </span>
        <span aria-hidden className="text-[var(--color-slate)] transition-transform group-open:rotate-45 font-mono text-sm">
          +
        </span>
      </summary>
      {hint && <p className="mt-1 text-[11px] text-[var(--color-muted)] leading-relaxed font-sans">{hint}</p>}
      <div className="mt-3">{children}</div>
    </details>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "border px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors rounded-none",
        on
          ? "border-[var(--canvas-dark,#0D0D0D)] bg-[var(--canvas-dark,#0D0D0D)] text-white font-medium"
          : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
      )}
    >
      {children}
    </button>
  );
}

function Checks<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected?: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <ul className="space-y-1.5">
      {options.map((o) => {
        const on = selected?.includes(o.value) ?? false;
        return (
          <li key={o.value}>
            <button
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => onToggle(o.value)}
              className="flex w-full items-center gap-2.5 py-1 text-left text-xs font-mono text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors"
            >
              <span
                className={cn(
                  "grid size-4 place-items-center border rounded-none transition-colors",
                  on
                    ? "border-[var(--canvas-dark,#0D0D0D)] bg-[var(--canvas-dark,#0D0D0D)] text-white"
                    : "border-[var(--color-line)] bg-white"
                )}
              >
                {on && <Check className="size-3 text-white" strokeWidth={3} aria-hidden />}
              </span>
              <span>{o.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Grades shown left to right as a scale (best to lower), each one a toggle. */
function Scale<T extends string>({
  options,
  selected,
  onToggle,
  columns = 8,
}: {
  options: { value: T; label: string }[];
  selected?: T[];
  onToggle: (v: T) => void;
  columns?: 4 | 8;
}) {
  return (
    <ul className={cn("grid gap-1 border-0", columns === 4 ? "grid-cols-4" : "grid-cols-8")}>
      {options.map((o) => {
        const on = selected?.includes(o.value) ?? false;
        return (
          <li key={o.value}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.value)}
              className={cn(
                "w-full py-1.5 text-[11px] font-mono text-center border transition-colors rounded-none",
                on
                  ? "border-[var(--canvas-dark,#0D0D0D)] bg-[var(--canvas-dark,#0D0D0D)] text-white font-bold"
                  : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--color-ink)]"
              )}
            >
              {o.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Two sliders (minimum and maximum). Results update when the shopper lets go. */
function RangeField({
  label,
  min,
  max,
  step,
  from,
  to,
  format,
  onCommit,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  from?: number;
  to?: number;
  format: (n: number) => string;
  onCommit: (from?: number, to?: number) => void;
}) {
  const [a, setA] = useState(from ?? min);
  const [b, setB] = useState(to ?? max);
  const commit = () => onCommit(a <= min ? undefined : +a.toFixed(2), b >= max ? undefined : +b.toFixed(2));
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  const common = {
    min,
    max,
    step,
    onPointerUp: commit,
    onKeyUp: commit,
    onBlur: commit,
    className:
      "pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-ink)] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-ink)] [&::-webkit-slider-thumb]:bg-white",
  };

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-line)]" />
        <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-ink)]" style={{ left: `${pct(a)}%`, right: `${100 - pct(b)}%` }} />
        <input type="range" {...common} aria-label={`Minimum ${label}`} aria-valuetext={format(a)} value={a} onChange={(e) => setA(Math.min(+e.target.value, b - step))} />
        <input type="range" {...common} aria-label={`Maximum ${label}`} aria-valuetext={format(b)} value={b} onChange={(e) => setB(Math.max(+e.target.value, a + step))} />
      </div>
      <p className="mt-2 flex justify-between text-xs font-mono text-[var(--color-slate)]">
        <span>Min: {format(a)}</span>
        <span>Max: {format(b)}</span>
      </p>
    </div>
  );
}

function PriceInputs({ from, to, onCommit }: { from?: number; to?: number; onCommit: (from?: number, to?: number) => void }) {
  const [a, setA] = useState(from ? String(from) : "");
  const [b, setB] = useState(to ? String(to) : "");
  const num = (s: string) => {
    const n = Number(s.replace(/[^\d]/g, ""));
    return s && Number.isFinite(n) && n > 0 ? n : undefined;
  };
  return (
    <form
      className="mt-3 flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        let lo = num(a);
        let hi = num(b);
        if (lo !== undefined && hi !== undefined && lo > hi) [lo, hi] = [hi, lo];
        onCommit(lo, hi);
      }}
    >
      <label className="flex-1 text-[11px] font-mono text-[var(--color-slate)] uppercase">
        Min ₹
        <input
          inputMode="numeric"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder={String(PRICE_BOUNDS.min)}
          className="mt-1 h-8 w-full px-2 text-xs font-mono bg-white border border-[var(--color-line)] text-[var(--color-ink)] outline-none rounded-none focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="flex-1 text-[11px] font-mono text-[var(--color-slate)] uppercase">
        Max ₹
        <input
          inputMode="numeric"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Any"
          className="mt-1 h-8 w-full px-2 text-xs font-mono bg-white border border-[var(--color-line)] text-[var(--color-ink)] outline-none rounded-none focus:border-[var(--color-ink)]"
        />
      </label>
      <button
        type="submit"
        className="h-8 px-3 text-[11px] font-mono uppercase tracking-wider bg-[var(--color-ink)] text-white hover:bg-black transition-colors rounded-none shrink-0"
      >
        Apply
      </button>
    </form>
  );
}
