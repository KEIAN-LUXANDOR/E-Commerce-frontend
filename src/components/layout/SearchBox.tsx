"use client";

import { formatPrice } from "@/lib/format";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { fetchProducts } from "@/lib/api/products-browser";
import type { Product } from "@/lib/types/product";

export interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  initialQuery?: string;
  compact?: boolean;
  onNavigate?: () => void;
  autoFocus?: boolean;
}

function formatPriceFromCents(cents?: number | null): string {
  if (typeof cents !== "number" || Number.isNaN(cents)) return "";
  return formatPrice(cents);
}

export function SearchBox({
  className = "",
  placeholder = "Search diamonds...",
  defaultValue = "",
  initialQuery = "",
  onNavigate,
  autoFocus = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue || initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ q: trimmed, size: 5 }, controller.signal);
        setResults(data.items);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search" className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          aria-label="Search diamonds"
          className="h-9 w-full rounded-[3px] border border-line bg-surface pl-8 pr-7 text-xs text-ink placeholder:text-slate/80 focus:border-loupe focus:outline-none focus:ring-1 focus:ring-loupe transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            aria-label="Clear search"
            className="absolute right-2 text-slate hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {open && query.trim().length >= 2 && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-72 sm:w-80 rounded-[4px] border border-line bg-surface shadow-lg">
          {loading ? (
            <div className="px-4 py-3 text-xs text-slate">Searching diamonds…</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-line">
              {results.map((item) => {
                const variant = item?.variants?.[0];
                const d = item?.diamond;
                const subtitle = d
                  ? [
                      d.carat ? `${Number(d.carat).toFixed(2)} ct` : null,
                      d.color,
                      d.clarity,
                      d.lab,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : "";
                return (
                  <li key={item.id ?? item.slug}>
                    <Link
                      href={`/diamond/${item.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-platinum transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ShapeIcon
                          shape={d?.shape ?? "ROUND"}
                          className="h-5 w-5 shrink-0 text-ink"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-ink">{item.name}</p>
                          {subtitle && (
                            <p className="truncate text-[11px] text-slate">{subtitle}</p>
                          )}
                        </div>
                      </div>
                      {variant?.pricePaise != null && (
                        <span className="shrink-0 text-xs font-medium tabular-nums text-ink">
                          {formatPriceFromCents(variant.pricePaise)}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-loupe hover:bg-platinum transition-colors"
                >
                  See all results for &ldquo;{query.trim()}&rdquo; →
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-xs text-slate">
              No quick matches. Press Enter to search all diamonds.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;