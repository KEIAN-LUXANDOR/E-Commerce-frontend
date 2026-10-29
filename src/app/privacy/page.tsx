import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy | Keian Luxandor",
  description:
    "Information regarding our compliance with Indian Digital Personal Data Protection (DPDP) Act and AML standards.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Legal Transparency
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-ink)]">
            Privacy Policy
          </h1>
          <p className="font-sans text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
            Effective: October 2026 &bull; Compliant with DPDP Act 2023
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 font-sans text-xs text-[var(--color-slate)] space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">1. Data Controller & Collection Scope</h2>
          <p>
            Keian Luxandor Private Limited operates as the data fiduciary for information submitted across our digital atelier. We collect legal identification credentials, contact phone numbers, delivery addresses, and PAN card copies strictly necessary for statutory anti-money laundering (AML) compliance and high-value transit insurance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">2. Statutory PAN Verification (Rule 114B)</h2>
          <p>
            Under Rule 114B of the Indian Income Tax Rules, 1962, high-value transactions involving precious stones exceeding ₹2,00,000 mandate the collection and verification of the purchaser&rsquo;s Permanent Account Number (PAN). This data is processed securely through authorized verification APIs and encrypted at rest using AES-256 protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">3. Third-Party Disclosures</h2>
          <p>
            We do not sell, rent, or trade your personal data. Disclosures are limited strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
            <li>Our courier partner, to deliver your order (name, phone number and delivery address only).</li>
            <li>Razorpay Software Private Limited for secure PCI-DSS tokenized payment execution.</li>
            <li>Official gemological verification registries (GIA, IGI) for certificate digital vault linkages.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">4. Rights of Data Principals</h2>
          <p>
            You retain the right to inspect, rectify, or request erasure of your non-statutory personal data by writing to our designated Data Protection Officer at <strong>compliance@keianluxandor.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
