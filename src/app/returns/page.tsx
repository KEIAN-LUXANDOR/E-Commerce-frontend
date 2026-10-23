import * as React from "react";
import type { Metadata } from "next";
import { RotateCcw, ShieldAlert, Award, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "15-Day Return Guarantee & Laboratory Re-Inspection | Keian Luxandor",
  description:
    "Review our 15-day complimentary return policy, tamper-evident security seal requirements, and gemological verification process.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Keian Luxandor &bull; Collector Protection
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            15-Day Return Policy
          </h1>
          <p className="font-sans text-sm md:text-base text-[var(--color-slate)] max-w-xl mx-auto">
            We offer a full 100% refund on unmounted loose diamonds returned within 15 calendar days of signed receipt, subject to intact security packaging.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
        {/* Conditions */}
        <div className="border border-[var(--color-line)] bg-white p-6 md:p-8 space-y-6">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Mandatory Return Requirements</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                  1. Intact Tamper-Evident Security Loop
                </h3>
                <p className="font-sans text-xs text-[var(--color-slate)] mt-0.5 leading-relaxed">
                  Every diamond is dispatched inside a sealed security cassette with a numbered tamper tag. Once cut or peeled, the stone cannot be returned as provenance cannot be guaranteed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                  2. Original Laboratory Dossier Included
                </h3>
                <p className="font-sans text-xs text-[var(--color-slate)] mt-0.5 leading-relaxed">
                  The original physical GIA or IGI laminated grading report must be returned. If missing or damaged, a ₹15,000 laboratory replacement re-issuance fee will be deducted from your refund.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                  3. Inbound Forensic Loupe Re-Inspection
                </h3>
                <p className="font-sans text-xs text-[var(--color-slate)] mt-0.5 leading-relaxed">
                  Upon arrival at our vault, our senior gemologists examine the girdle laser inscription under 20x magnification to confirm exact diamond identity prior to refund release.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Armoured Return Process */}
        <div className="border border-[var(--color-line)] bg-[var(--color-stone)] p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4 text-[var(--color-ink)]" />
            <h3 className="font-serif text-lg text-[var(--color-ink)]">Complimentary Armoured Collection</h3>
          </div>
          <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
            Never return a high-value diamond via regular postal mail. Contact your private concierge at <strong>concierge@keianluxandor.com</strong> or via WhatsApp. We will dispatch an armed Sequel courier to collect and seal the parcel in your presence.
          </p>
        </div>
      </div>
    </div>
  );
}
