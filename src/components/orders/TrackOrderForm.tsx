"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { FormAlert, TextField } from "@/components/auth/FormParts";
import { NotAvailableYet } from "@/components/common/NotAvailableYet";
import { formatDate, formatDateTime, OrderProgress, OrderStatusBadge } from "@/components/orders/OrderBits";
import { isEnabled } from "@/config/features";
import { trackOrder } from "@/lib/api/orders";
import { ORDER_STATUS_LABEL, type TrackingResult } from "@/lib/types/order";

/** Public order tracking: order number + email (POST /orders/track, planned). No prices or full address shown. */
export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!isEnabled("orderTracking")) {
    return (
      <div className="mt-8 space-y-4">
        <NotAvailableYet title="Online tracking is coming soon" whatsappText="Hello Keian Luxandor, could you tell me where my order is? My order number is ">
          Send us your order number and we’ll tell you exactly where your diamond is. Once it’s shipped, your email also has the courier’s tracking link.
        </NotAvailableYet>
        <p className="text-sm text-slate">
          Have an account? <Link href="/account/orders" className="link">See your orders</Link>.
        </p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const number = orderNumber.trim().toUpperCase();
    if (!/^KL\d{6,}$/.test(number)) {
      setError("Order numbers look like KL100001.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the email address you used to order.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const found = await trackOrder({ orderNumber: number, email: email.trim().toLowerCase() });
      if (!found) setError("We couldn’t find an order with these details. Check the order number and email, or contact us.");
      setResult(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t check this order.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={submit} noValidate className="grid gap-4 border border-line bg-stone p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <TextField label="Order number" placeholder="KL100001" autoCapitalize="characters" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Checking…" : "Track"}
        </button>
      </form>
      {error && (
        <div className="mt-4">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      {result && (
        <section aria-live="polite" className="mt-8 space-y-6 border border-line p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl">Order {result.orderNumber}</h2>
            <OrderStatusBadge status={result.status} />
          </div>
          <p className="text-sm text-slate">
            Placed {formatDate(result.placedAt)} · Delivering to {result.deliverTo.city} {result.deliverTo.pincode}
          </p>
          <OrderProgress status={result.status} />
          {result.shipment && (
            <p className="text-sm">
              Sent with {result.shipment.courier}, tracking number <strong className="font-medium">{result.shipment.trackingNumber}</strong>.{" "}
              {result.shipment.trackingUrl && (
                <a href={result.shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                  Courier tracking <ExternalLink className="size-4" aria-hidden />
                </a>
              )}
            </p>
          )}
          <ol className="space-y-2 border-t border-line pt-4 text-sm">
            {result.timeline.map((t) => (
              <li key={`${t.status}-${t.at}`} className="flex justify-between gap-4">
                <span>{ORDER_STATUS_LABEL[t.status]}</span>
                <span className="text-slate">{formatDateTime(t.at)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
