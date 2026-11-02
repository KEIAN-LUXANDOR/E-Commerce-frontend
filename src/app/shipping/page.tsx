import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Truck, Lock, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Keian Luxandor",
  description:
    "How certified diamonds are prepared, insured and dispatched. International delivery is currently confirmed individually before an order is accepted.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-slate)]">
            Keian Luxandor &bull; Logistics Transparency
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            Shipping & Delivery
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--color-slate)] max-w-xl mx-auto">
            Complimentary delivery is available for domestic orders across India. For the United States, United Kingdom, UAE, Canada, Europe and Australia, contact our concierge to confirm whether delivery can be arranged.
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
              Most domestic orders arrive within 3–7 working days after dispatch. International delivery timing is confirmed individually before an order is accepted.
            </p>
          </div>
        </div>

        <section className="border border-[var(--color-line)] bg-white p-6 md:p-8 space-y-3">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
            International destinations
          </p>
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">
            Confirm the full journey before you order.
          </h2>
          <p className="font-sans text-sm leading-relaxed text-[var(--color-slate)]">
            International shipping is not yet available as an automatic checkout option. Our team must first confirm destination eligibility, carrier arrangements, insurance, delivery timing and the treatment of any import duties or taxes. We will provide the applicable charges and delivery terms in writing before accepting payment for an international order.
          </p>
          <a
            href="mailto:info@keianluxandor.com?subject=International%20shipping%20enquiry"
            className="inline-flex text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] underline underline-offset-4"
          >
            Enquire about international shipping
          </a>
        </section>

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
