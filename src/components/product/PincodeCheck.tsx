"use client";

import { Truck } from "lucide-react";
import { useId, useState } from "react";
import { createLocalStore } from "@/lib/local-store";
import { fetchPincode } from "@/lib/api/catalog-browser";
import { addDays, formatShortDate } from "@/lib/format";
import type { PincodeResult } from "@/lib/types/catalog";

const lastPin = createLocalStore<string>("ad.pincode.v1", "");

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; result: PincodeResult };

/** "Delivered by Fri, 24 Oct" or "Not serviceable", based on the courier's PIN code list. Remembers the last PIN. */
export function PincodeCheck() {
  const id = useId();
  const saved = lastPin.useValue();
  const [pin, setPin] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const value = pin ?? saved;

  async function check(p: string) {
    if (!/^[1-9]\d{5}$/.test(p)) {
      setStatus({ kind: "error", message: "Enter a 6-digit PIN code." });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const result = await fetchPincode(p);
      lastPin.set(p);
      setStatus({ kind: "done", result });
    } catch {
      setStatus({ kind: "error", message: "Couldn’t check this PIN code right now. Try again." });
    }
  }

  return (
    <div className="border-t border-line pt-5">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        <Truck className="size-4" aria-hidden /> Check delivery to your PIN code
      </label>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          check(value);
        }}
      >
        <input
          id={id}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="e.g. 411001"
          value={value}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          aria-describedby={`${id}-result`}
          className="field max-w-40 tabular-nums"
        />
        <button type="submit" className="btn btn-secondary" disabled={status.kind === "loading"}>
          {status.kind === "loading" ? "Checking…" : "Check"}
        </button>
      </form>
      <p id={`${id}-result`} aria-live="polite" className="mt-2 min-h-5 text-sm">
        {status.kind === "error" && <span className="text-out">{status.message}</span>}
        {status.kind === "done" &&
          (status.result.serviceable ? (
            <span className="text-ok">
              Delivered by {formatShortDate(addDays(new Date(), status.result.maxDays ?? 6))}
              {status.result.city ? ` in ${status.result.city}` : ""}, insured and signed for.
            </span>
          ) : (
            <span className="text-out">
              We can’t deliver insured parcels to {status.result.pincode} yet. Message us on WhatsApp and we’ll arrange another way.
            </span>
          ))}
      </p>
    </div>
  );
}
