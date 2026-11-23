"use client";

import { useState, type FormEvent } from "react";
import { Truck } from "lucide-react";
import { isEnabled } from "@/config/features";
import { checkPincode, type PincodeResult } from "@/lib/api/support";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { useMarket } from "@/components/market/MarketProvider";
import type { MarketCountry } from "@/lib/market/countries";
import { getPostalCodeLabel, getPostalCodePlaceholder, validatePostalCode } from "@/lib/market/address-validation";
import { cn } from "@/lib/utils";

interface PincodeCheckPanelProps {
  country: MarketCountry;
  countryCode: string;
  hydrated: boolean;
}

/** Country-specific panel; changing country remounts it and clears stale input/results. */
function PincodeCheckPanel({ country, countryCode, hydrated }: PincodeCheckPanelProps) {
  const [postalCode, setPostalCode] = useState("");
  const [result, setResult] = useState<PincodeResult>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!hydrated) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-slate shadow-xs">
        <Truck className="size-5 shrink-0 text-brand-accent" aria-hidden="true" />
        <span>Preparing delivery options…</span>
      </div>
    );
  }

  if (!isEnabled("pincodeCheck")) {
    return (
      <div className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm shadow-xs">
        <Truck className="mt-0.5 size-5 shrink-0 text-brand-accent" aria-hidden />
        <p className="text-xs leading-relaxed text-slate">
          <strong className="font-semibold text-ink">Delivery to {country.name}.</strong> Contact our atelier to confirm destination eligibility and an insured delivery estimate.
        </p>
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validatePostalCode(postalCode, countryCode);
    if (validationError) {
      setError(validationError);
      setResult(undefined);
      return;
    }

    setError(undefined);
    setResult(undefined);
    setBusy(true);
    try {
      setResult(await checkPincode(postalCode, countryCode));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't verify delivery to this destination.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
      <form onSubmit={submit} className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-accent-muted/60 text-ink"><Truck className="size-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Check delivery to {country.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate">Enter your postal code to check destination availability and the estimated delivery window.</p>
          </div>
        </div>
        <label htmlFor="delivery-postal-code" className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate">{getPostalCodeLabel(countryCode)}</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="delivery-postal-code"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            maxLength={12}
            placeholder={getPostalCodePlaceholder(countryCode)}
            value={postalCode}
            onChange={(event) => {
              setPostalCode(event.target.value.toUpperCase());
              setError(undefined);
              setResult(undefined);
            }}
            className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-slate/60 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10"
            aria-describedby="delivery-postal-result"
          />
          <Button type="submit" size="sm" disabled={busy} isLoading={busy} className="min-w-28 shadow-xs">
            {busy ? "Checking…" : "Check delivery"}
          </Button>
        </div>
        <p id="delivery-postal-result" aria-live="polite" className="text-xs">
          {error && <span className="font-medium text-out">{error}</span>}
          {result?.serviceable && <span className="font-medium text-ok">Delivery is available to {result.city ?? result.pincode}.</span>}
          {result && !result.serviceable && <span className="font-medium text-out">Delivery could not be confirmed for this postal code. Please contact our concierge.</span>}
          {!result && !error && <span className="text-slate">Destination: {country.name} · {site.returnDays}-day returns policy</span>}
        </p>
      </form>

      <div className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none", result?.serviceable ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="min-h-0 overflow-hidden">
          {result?.serviceable && (
            <div className="border-t border-line bg-brand-accent-muted/20 px-4 py-3 sm:px-5">
              <p className="text-sm font-semibold text-ink">Estimated delivery</p>
              {result.minDays != null && result.maxDays != null ? (
                <p className="mt-1 text-xs text-slate">{result.minDays}–{result.maxDays} working days after dispatch.</p>
              ) : (
                <p className="mt-1 text-xs text-slate">The destination is serviceable. The delivery window will be confirmed with your order.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Country-aware serviceability check backed by the existing delivery endpoint. */
export function PincodeCheck() {
  const market = useMarket();
  return (
    <PincodeCheckPanel
      key={market.countryCode}
      country={market.country}
      countryCode={market.countryCode}
      hydrated={market.hydrated}
    />
  );
}

export default PincodeCheck;
