"use client";

import { Truck } from "lucide-react";
import { useState } from "react";
import { isEnabled } from "@/config/features";
import { checkPincode, type PincodeResult } from "@/lib/api/support";
import { site } from "@/lib/site";

/** "Check delivery to your PIN code" on the diamond page (GET /delivery/pincode/{pin}, planned). */
export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<PincodeResult>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!isEnabled("pincodeCheck")) {
    return (
      <div className="flex gap-3 border border-line p-4 text-sm">
        <Truck className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden />
        <p className="text-slate">
          <span className="font-medium text-ink">Free insured delivery across India.</span> Most orders arrive in 3–7 working days after dispatch. Ask us for an exact date for your PIN code.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setError("Enter a 6-digit PIN code.");
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
    <form onSubmit={submit} className="border border-line p-4">
      <label htmlFor="pin" className="section-eyebrow text-ink">
        Check delivery
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="pin"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="6-digit PIN code"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="field min-h-11"
          aria-describedby="pin-result"
        />
        <button type="submit" className="btn btn-primary min-h-11" disabled={busy}>
          {busy ? "Checking…" : "Check"}
        </button>
      </div>
      <div id="pin-result" aria-live="polite" className="mt-2 text-sm">
        {error && <p className="text-out">{error}</p>}
        {result && result.serviceable && (
          <p className="flex items-center gap-2 text-ok">
            <Truck className="size-4" aria-hidden />
            Delivers to {result.city ?? result.pincode} in {result.minDays}–{result.maxDays} working days after dispatch. Free and insured.
          </p>
        )}
        {result && !result.serviceable && <p className="text-out">We can’t deliver to this PIN code online yet. Please contact us and we’ll arrange it.</p>}
        {!result && !error && <p className="text-slate">Free insured delivery · {site.returnDays}-day returns</p>}
      </div>
    </form>
  );
}
