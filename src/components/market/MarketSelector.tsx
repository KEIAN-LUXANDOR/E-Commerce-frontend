"use client";

import { ChevronDown, Globe2 } from "lucide-react";
import { MARKET_GROUPS } from "@/lib/market/countries";
import { useMarket } from "@/components/market/MarketProvider";

interface MarketSelectorProps {
  compact?: boolean;
  className?: string;
}

export function MarketSelector({
  compact = false,
  className = "",
}: MarketSelectorProps) {
  const { countryCode, country, currency, setCountryCode } = useMarket();

  return (
    <div className={`${compact ? "inline-flex" : "flex w-full flex-col gap-2"} ${className}`}>
      {!compact && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate">
          Shopping region · prices in USD
        </span>
      )}

      <label className="relative inline-flex min-w-0 items-center">
        <Globe2
          aria-hidden="true"
          className="pointer-events-none absolute left-3 z-[1] h-4 w-4 text-brand-accent"
          strokeWidth={1.6}
        />
        <select
          aria-label={`Shopping country, currently ${country.name}. Prices in ${currency}.`}
          value={countryCode}
          onChange={(event) => setCountryCode(event.target.value)}
          className={[
            "h-10 w-full min-w-0 appearance-none rounded-full",
            "border border-line bg-white text-xs font-medium text-ink",
            "pl-9 pr-9 shadow-sm outline-none transition-colors",
            "hover:border-brand-accent/50 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15",
            compact ? "max-w-[172px]" : "",
          ].join(" ")}
        >
          {MARKET_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name} · {currency}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 h-4 w-4 text-slate"
          strokeWidth={1.6}
        />
      </label>
    </div>
  );
}

export default MarketSelector;
