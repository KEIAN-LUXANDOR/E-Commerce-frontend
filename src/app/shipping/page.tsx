import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Truck, Lock, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Keian Luxandor",
  description:
    "Free delivery across India for every certified diamond: how we pack, ship and hand over your order.",
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
            Shipping & Delivery
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--color-slate)] max-w-xl mx-auto">
            Delivery is free across India. Every diamond is checked against its grading report before it leaves our Baner, Pune showroom.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[var(--color-line)] p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <Truck className="size-5" />
              <h2 className="font-serif text-lg">Trusted courier</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              We ship with a courier suited to high-value parcels. Once your order is dispatched we email you the courier name and tracking number.
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
              <h2 className="font-serif text-lg">Signed delivery</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Someone needs to be at the address to receive and sign for the parcel. Check the seal before you sign.
            </p>
          </div>

          <div className="border border-[var(--color-line)] p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <Clock className="size-5" />
              <h2 className="font-serif text-lg">Transit Timelines</h2>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              Most orders arrive within 3–7 working days after dispatch.
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
