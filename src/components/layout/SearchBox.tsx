"use client";

import { Clock, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { ShapeIcon } from "@/components/art/ShapeIcon";
import { fetchSuggestions } from "@/lib/api/catalog-browser";
import { formatINR } from "@/lib/format";
import { clearRecentSearches, rememberSearch, useRecentSearches } from "@/lib/stores";
import type { SearchSuggestion } from "@/lib/types/catalog";

interface Option {
  key: string;
  label: string;
  href: string;
  suggestion?: SearchSuggestion;
  recent?: boolean;
}

/**
 * Search field with suggestions (combobox pattern).
 * Waits 250 ms after typing, cancels old requests, and supports ↑ ↓ Enter Esc.
 */
export function SearchBox({ autoFocus, onNavigate, className }: { autoFocus?: boolean; onNavigate?: () => void; className?: string }) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const recent = useRecentSearches();
  const timer = useRef<number | undefined>(undefined);
  const abort = useRef<AbortController | undefined>(undefined);

  const term = query.trim();
  const options: Option[] =
    term.length < 2
      ? recent.map((r) => ({ key: `r-${r}`, label: r, href: `/search?q=${encodeURIComponent(r)}`, recent: true }))
      : [
          ...suggestions.map((s) => ({ key: s.href, label: s.label, href: s.href, suggestion: s })),
          { key: "all", label: `See all results for “${term}”`, href: `/search?q=${encodeURIComponent(term)}` },
        ];

  function onChange(value: string) {
    setQuery(value);
    setActive(-1);
    setOpen(true);
    window.clearTimeout(timer.current);
    abort.current?.abort();
    if (value.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(() => {
      const ctrl = new AbortController();
      abort.current = ctrl;
      fetchSuggestions(value.trim(), ctrl.signal)
        .then((s) => setSuggestions(s))
        .catch((e: unknown) => {
          if ((e as Error).name !== "AbortError") setSuggestions([]);
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setLoading(false);
        });
    }, 250);
  }

  function go(href: string, searchTerm?: string) {
    if (searchTerm) rememberSearch(searchTerm);
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  }

function getPreviousActiveIndex(currentIndex: number, totalOptions: number): number {
  if (totalOptions === 0) {
    return -1;
  }
  if (currentIndex <= 0) {
    return totalOptions - 1;
  }
  return currentIndex - 1;
}

function getNextActiveIndex(currentIndex: number, totalOptions: number): number {
  if (totalOptions === 0) {
    return -1;
  }
  return (currentIndex + 1) % totalOptions;
}

function getSearchTermForOption(opt: Option, currentTerm: string): string | undefined {
  if (opt.recent) {
    return opt.label;
  }
  if (opt.suggestion) {
    return undefined;
  }
  return currentTerm;
}

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => getNextActiveIndex(i, options.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => getPreviousActiveIndex(i, options.length));
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[active];
      if (opt) {
        go(opt.href, getSearchTermForOption(opt, term));
      } else if (term) {
        go(`/search?q=${encodeURIComponent(term)}`, term);
      }
    }
  }

  const showList = open && (options.length > 0 || (term.length >= 2 && !loading));

  return (
    <div className={`relative ${className ?? ""}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (term) go(`/search?q=${encodeURIComponent(term)}`, term);
        }}
      >
        <label htmlFor={`${id}-input`} className="sr-only">
          Search diamonds
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate" aria-hidden />
        <input
          id={`${id}-input`}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Search shape, carat, colour, report no…"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className="field h-10 min-h-0 rounded-full border-line bg-paper pl-9 pr-9 text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate hover:bg-platinum"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </form>

      {showList && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-[4px] border border-line bg-surface shadow-[0_12px_32px_rgb(23_32_51/0.14)]">
          {term.length < 2 && recent.length > 0 && (
            <div className="flex items-center justify-between px-4 pt-3 text-xs text-slate">
              <span>Recent searches</span>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={clearRecentSearches} className="hover:text-ink hover:underline">
                Clear
              </button>
            </div>
          )}
          <ul id={listId} role="listbox" aria-label="Search suggestions" className="py-1.5">
            {options.map((opt, i) => (
              <li
                key={opt.key}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(opt.href, getSearchTermForOption(opt, term))}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm ${i === active ? "bg-platinum" : ""} ${
                  opt.key === "all" ? "border-t border-line font-medium text-loupe" : ""
                }`}
              >
                {opt.recent && <Clock className="size-4 text-slate" aria-hidden />}
                {opt.suggestion?.type === "DIAMOND" && opt.suggestion.shape && (
                  <ShapeIcon shape={opt.suggestion.shape} className="size-7 shrink-0 text-ink" />
                )}
                {opt.suggestion?.type === "CATEGORY" && <Search className="size-4 text-slate" aria-hidden />}
                <span className="flex-1 truncate">{opt.label}</span>
                {opt.suggestion?.pricePaise !== undefined && (
                  <span className="shrink-0 tabular-nums text-slate">{formatINR(opt.suggestion.pricePaise)}</span>
                )}
              </li>
            ))}
          </ul>
          {term.length >= 2 && !loading && suggestions.length === 0 && (
            <p className="px-4 pb-3 text-sm text-slate">No quick matches. Press Enter to search everything.</p>
          )}
        </div>
      )}
    </div>
  );
}
