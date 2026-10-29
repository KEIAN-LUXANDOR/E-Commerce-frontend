"use client";

import { Truck } from "lucide-react";
import { useState } from "react";
import { isEnabled } from "@/config/features";
import { checkPincode, type PincodeResult } from "@/lib/api/support";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";

/** "Check delivery to your PIN code" on the diamond page. */
export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<PincodeResult>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!isEnabled("pincodeCheck")) {
    return (
      <div className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm shadow-xs">
        <Truck className="mt-0.5 size-5 shrink-0 text-brand-accent" aria-hidden />
        <p className="text-slate text-xs leading-relaxed">
          <strong className="font-semibold text-ink">Free delivery across India.</strong> Most orders arrive in 3–7 working days after dispatch.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setError("Enter a valid 6-digit Indian PIN code.");
      setResult(undefined);
      return;
    }
    setError(undefined);
    setBusy(true);
    try {
      setResult(await checkPincode(pin));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t check this PIN code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-line bg-surface p-4 shadow-xs space-y-3">
      <label htmlFor="pin" className="block text-[11px] font-semibold uppercase tracking-wider text-slate font-mono">
        Check delivery to your PIN code
      </label>
      <div className="flex gap-2">
        <input
          id="pin"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="6-digit PIN code"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="h-11 flex-1 rounded-lg border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none transition-colors"
          aria-describedby="pin-result"
        />
        <Button type="submit" size="sm" disabled={busy} isLoading={busy} className="shadow-xs">
          {busy ? "Checking…" : "Check"}
        </Button>
      </div>
      <div id="pin-result" aria-live="polite" className="text-xs">
        {error && <p className="text-out font-medium">{error}</p>}
        {result && result.serviceable && (
          <p className="flex items-center gap-2 text-ok font-medium">
            <Truck className="size-4 shrink-0" aria-hidden />
            Delivers to {result.city ?? result.pincode} in {result.minDays}–{result.maxDays} working days. Free delivery.
          </p>
        )}
        {result && !result.serviceable && (
          <p className="text-out font-medium">
            We can&apos;t deliver to this PIN code automatically. Please message us and we’ll arrange delivery.
          </p>
        )}
        {!result && !error && (
          <p className="text-slate font-mono">Free delivery · {site.returnDays}-day returns</p>
        )}
      </div>
    </form>
  );
}

export default PincodeCheck;
