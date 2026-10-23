import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Truck, Lock, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Insured Armoured Shipping & Delivery Protocols | Keian Luxandor",
  description:
    "Learn about our complimentary, fully-insured armoured escort transit operated exclusively by Sequel and Malca-Amit.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Keian Luxandor &bull; Logistics Transparency
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            Insured Armoured Transit
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--color-slate)] max-w-xl mx-auto">
            Every diamond leaves our vault under 100% full-value Lloyd&rsquo;s insurance coverage, escorted directly by specialized luxury transit couriers.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[var(--color-line)] p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <Truck className="size-5" />
              <h2 className="font-serif text-lg">Specialized Armoured Logistics</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              We never utilize conventional parcel carriers. All orders are transported exclusively by <strong>Sequel Logistics</strong> or <strong>Malca-Amit</strong> in bullet-resistant, GPS-tracked vehicles with armed guards.
            </p>
          </div>

          <div className="border border-[var(--color-line)] p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <Lock className="size-5" />
              <h2 className="font-serif text-lg">Tamper-Evident Security Seals</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Each diamond dossier is placed inside a serialized, barcoded security pouch. If the seal has been compromised, cut, or shows residue, do not sign for delivery.
            </p>
          </div>

          <div className="border border-[var(--color-line)] p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <ShieldCheck className="size-5 text-emerald-700" />
              <h2 className="font-serif text-lg">100% Comprehensive Insurance</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Risk of loss remains strictly with Keian Luxandor until the package is handed over and verified via one-time PIN (OTP) and signed by the recipient.
            </p>
          </div>

          <div className="border border-[var(--color-line)] p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <Clock className="size-5" />
              <h2 className="font-serif text-lg">Transit Timelines</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Domestic shipments across Tier-1 Indian metropolitan cities arrive within 48 to 72 business hours post gemological audit.
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-line)] bg-[var(--color-stone)] p-6 text-center space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] font-semibold">
            Digital Vault Verification Handshake
          </p>
          <p className="font-sans text-xs text-[var(--color-slate)] max-w-lg mx-auto">
            Prior to release, the courier officer will request your physical photo government ID and the 6-digit verification code sent via SMS to your registered telephone number.
          </p>
        </div>
      </div>
    </div>
  );
}
