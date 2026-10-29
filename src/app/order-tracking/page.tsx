"use client";

import { useState } from "react";

import { Search,       MessageCircle, AlertCircle } from "lucide-react";
import { isEnabled } from "@/config/features";
import { trackOrder } from "@/lib/api/orders";
import {  whatsappUrl } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { TrackingResult, } from "@/lib/types/order";
import { ORDER_STATUS_LABEL } from "@/lib/types/order";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);

  const trackingEnabled = isEnabled("orderTracking");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both your order number and email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    if (trackingEnabled) {
      try {
        const data = await trackOrder({
          orderNumber: orderNumber.trim(),
          email: email.trim().toLowerCase(),
        });
        if (!data) {
          setError("No shipment found matching that order number and email address. Please check your order confirmation.");
          setResult(null);
        } else {
          setResult(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to retrieve tracking details right now.");
        setResult(null);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online tracking isn't live yet: never show made-up shipment details
    setLoading(false);
    setResult(null);
    setError("Online tracking isn't switched on yet. Message us on WhatsApp or email with your order number and we'll send you the latest status.");
  };

  const whatsappInquiry = whatsappUrl(
    orderNumber
      ? `Hello Keian Luxandor, I am checking the dispatch status of my order #${orderNumber.trim()}. Could you provide the latest transit milestone?`
      : "Hello Keian Luxandor, I would like to check the transit status of my loose diamond order."
  );

  return (
    <div className="page py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="eyebrow">Order status</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
          Track Your Consignment
        </h1>
        <p className="mt-3 text-sm text-slate leading-relaxed">
          Enter your order number and the email you used to order. Delivery across India is free.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="mt-8 max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label htmlFor="page-f1" className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1.5 font-mono">
              Order Number *
            </label>
            <input id="page-f1"
              type="text"
              required
              placeholder="e.g. KL100003"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full h-12 rounded-lg border border-line bg-surface px-4 text-sm font-mono text-ink uppercase tracking-wider focus:border-ink focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="page-f2" className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1.5 font-mono">
              Account Email *
            </label>
            <input id="page-f2"
              type="email"
              required
              placeholder="e.g. client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              isLoading={loading}
              leftIcon={!loading ? <Search className="size-4" /> : undefined}
              className="w-full shadow-md"
            >
              {loading ? "Locating Consignment..." : "Locate Consignment"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-out/20 bg-out-bg p-3.5 text-xs text-out font-medium">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Tracking Results Area */}
      {searched && result && (
        <div className="mt-12 max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="eyebrow">Consignment Record</p>
              <h2 className="mt-1 font-serif text-2xl font-medium text-ink">
                Order #{result.orderNumber}
              </h2>
              <p className="text-xs text-slate mt-0.5 font-mono">
                Placed on {formatDate(result.placedAt)}
              </p>
            </div>
            <div>
              <span className="inline-block border border-line bg-stone px-3 py-1 rounded text-xs font-mono font-medium uppercase tracking-wider text-ink">
                {ORDER_STATUS_LABEL[result.status] || result.status}
              </span>
            </div>
          </div>

          {/* Courier Milestone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-line bg-stone p-4">
              <p className="text-slate uppercase tracking-wider text-[10px] font-mono">Secure Carrier</p>
              <p className="font-semibold text-ink mt-1">{result.shipment?.courier || "To be confirmed"}</p>
            </div>
            <div className="rounded-xl border border-line bg-stone p-4">
              <p className="text-slate uppercase tracking-wider text-[10px] font-mono">Tracking Number / AWB</p>
              <p className="font-mono font-bold text-ink mt-1">{result.shipment?.trackingNumber || "Assigned on Dispatch"}</p>
            </div>
            <div className="rounded-xl border border-line bg-stone p-4">
              <p className="text-slate uppercase tracking-wider text-[10px] font-mono">Courier tracking</p>
              <p className="font-semibold text-ok mt-1">{result.shipment?.trackingUrl ? <a href={result.shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="underline">Open tracking page</a> : "Shared once dispatched"}</p>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink font-mono">
              Milestone Timeline
            </h3>

            <ol className="relative border-l border-line ml-3 space-y-6">
              <li className="ml-6">
                <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full border border-ink bg-ink" />
                <p className="text-xs font-semibold text-ink">Order Confirmed &amp; Payment Cleared</p>
                <p className="text-[11px] text-slate mt-0.5">Diamond held exclusively in Pune vaults.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full border border-line bg-surface" />
                <p className="text-xs font-semibold text-ink">20x Forensic Loupe &amp; Certificate QC</p>
                <p className="text-[11px] text-slate mt-0.5">Girdle inscription verified against laboratory certificate.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full border border-line bg-surface" />
                <p className="text-xs font-semibold text-ink">Tamper-Evident Enclosure &amp; Handover</p>
                <p className="text-[11px] text-slate mt-0.5">Handed to the courier with tracking details.</p>
              </li>
              <li className="ml-6">
                <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full border border-line bg-surface" />
                <p className="text-xs font-semibold text-ink">Delivered</p>
                <p className="text-[11px] text-slate mt-0.5">Signed for at your address.</p>
              </li>
            </ol>
          </div>

          {/* Action assistance */}
          <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate">
              Need immediate updates on courier location or delivery scheduling?
            </p>
            {whatsappInquiry && (
              <a
                href={whatsappInquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-stone transition-colors shrink-0"
              >
                <MessageCircle className="size-3.5 text-[#1f7a4d]" />
                Inquire on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
