"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FormAlert } from "@/components/auth/FormParts";
import { isEnabled } from "@/config/features";
import { requestReturn } from "@/lib/api/orders";
import { site } from "@/lib/site";
import type { Order } from "@/lib/types/order";

const REASONS = [
  { value: "CHANGED_MIND", label: "I changed my mind" },
  { value: "NOT_AS_DESCRIBED", label: "It isn’t as described" },
  { value: "DAMAGED", label: "It arrived damaged" },
  { value: "OTHER", label: "Something else" },
];

/** "Return this order" for a delivered order inside the return window (POST …/return, planned). */
export function ReturnRequest({ order, onDone }: { order: Order; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState<number>();

  useEffect(() => {
    const timer = window.setTimeout(() => setNow(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const deliveredAt = order.shipment?.deliveredAt;
  const withinWindow = deliveredAt && now !== undefined
    ? now - new Date(deliveredAt).getTime() <= site.returnDays * 86400000
    : false;
  if (!withinWindow) return null;

  if (!isEnabled("returns")) {
    return (
      <p className="border border-line p-4 text-sm">
        Want to return this diamond? <Link href="/contact" className="link">Contact us</Link> within {site.returnDays} days of delivery and we’ll arrange a free insured pickup.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Choose a reason.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await requestReturn(order.orderNumber, { reason, details: details.trim() });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t send your request.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>
        Return this order
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 border border-line p-5">
      <h3 className="text-2xl">Return this order</h3>
      <p className="text-sm text-slate">We’ll collect the diamond with its report (free and insured), check it, and refund you in full.</p>
      {error && <FormAlert>{error}</FormAlert>}
      <fieldset>
        <legend className="text-sm font-medium">Why are you returning it?</legend>
        <div className="mt-2 space-y-1">
          {REASONS.map((r) => (
            <label key={r.value} className="flex min-h-10 items-center gap-3 text-sm">
              <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="size-4 accent-ink" />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium">
        Anything else we should know? <span className="font-normal text-slate">(optional)</span>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} maxLength={1000} className="field mt-1.5" />
      </label>
      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Sending…" : "Send return request"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
