"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { isEnabled } from "@/config/features";
import { trackOrder } from "@/lib/api/orders";
import type { TrackingResult } from "@/lib/types/order";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrackingResult>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const enabled = isEnabled("orderTracking");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) return;
    setLoading(true);
    setError(undefined);
    setResult(undefined);
    try {
      const tracked = await trackOrder({ orderNumber: orderNumber.trim(), email: email.trim() });
      if (!tracked) {
        setError("We couldn't find an order matching those details.");
        return;
      }
      setResult(tracked);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not find tracking information.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {!enabled && <NotAvailableYet title="Order tracking is not available yet">Please contact us if you need help with an order.</NotAvailableYet>}
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4 border border-line bg-surface p-8">
        <label className="block space-y-1 text-sm">
          Order number
          <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="field" />
        </label>
        <label className="block space-y-1 text-sm">
          Email used for the order
          <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </label>
        <button type="submit" disabled={!enabled || loading || !orderNumber.trim() || !email.trim()} className="btn btn-primary w-full disabled:opacity-50">
          {loading ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Track order"}
        </button>
        {error && <p role="alert" className="text-sm text-out">{error}</p>}
      </form>
      {result && (
        <section className="mx-auto max-w-md border border-line bg-surface p-8">
          <p className="text-xs uppercase tracking-widest text-slate">Order {result.orderNumber}</p>
          <h2 className="mt-1 text-xl font-medium text-ink">{result.status.replaceAll("_", " ")}</h2>
          <p className="mt-2 text-sm text-slate">Delivering to {result.deliverTo.city}, {result.deliverTo.pincode}</p>
          {result.shipment?.trackingUrl && <a className="btn-link mt-4 inline-block" href={result.shipment.trackingUrl} target="_blank" rel="noreferrer">Courier tracking</a>}
        </section>
      )}
    </div>
  );
}

export default TrackOrderForm;
