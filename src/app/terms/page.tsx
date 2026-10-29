import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Acquisition & Gemological Warranties | Keian Luxandor",
  description:
    "Terms and conditions governing the purchase, certification, insurance, and delivery of loose solitaires.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Legal Terms
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            Terms of Acquisition
          </h1>
          <p className="font-sans text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
            Last Updated: October 2026 &bull; Jurisdiction: Mumbai, India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 font-sans text-xs text-[var(--color-slate)] space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">1. General Provisions & Scope</h2>
          <p>
            These Terms of Acquisition govern every sale and reservation of loose natural or laboratory-grown diamonds transacted through Keian Luxandor. By placing an order via our digital platform or private concierge desk, you represent and warrant that you are legally competent under the Indian Contract Act, 1872.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">2. Gemological Certification Warranty</h2>
          <p>
            Every diamond sold is warranted to match precisely the metrological attributes (carat, color, clarity, cut, proportions, laser inscription) documented on its accompanying official Gemological Institute of America (GIA) or International Gemological Institute (IGI) dossier. The laboratory grading represents an independent scientific opinion established at the date of inspection.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">3. Pricing & Statutory Goods and Services Tax (GST)</h2>
          <p>
            All prices are quoted in Indian Rupees (INR) and are inclusive of the applicable 3% Goods and Services Tax (GST) on polished precious stones. Keian Luxandor issues formal tax invoices referencing the purchaser&rsquo;s GSTIN or PAN details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">4. Custody Transfer & Passage of Risk</h2>
          <p>
            Title and risk in the goods pass to the customer when the parcel is delivered and signed for at the delivery address.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">5. Governing Law & Arbitration</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the Republic of India. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
          </p>
        </section>
      </div>
    </div>
  );
}
