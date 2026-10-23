import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Award, Eye, Truck, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Atelier | Keian Luxandor Certified Diamonds",
  description:
    "Learn about Keian Luxandor's disciplined gemological curation, online-only pricing model, and direct laboratory partnerships.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-white text-[var(--color-ink)]">
      {/* Editorial Hero */}
      <section className="border-b border-[var(--color-line)] bg-white py-16 sm:py-24">
        <div className="page max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">About</span>
          </nav>

          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-slate)]">
            Institutional Diamond Atelier
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[var(--color-ink)] sm:text-6xl leading-[1.1]">
            Disciplined lapidary authority &amp; <span className="italic font-normal">direct digital provenance</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-slate)] leading-relaxed font-light">
            Keian Luxandor was founded upon a singular principle: that luxury diamond procurement should be governed by analytical transparency, forensic certification, and uncompromising value. By operating exclusively online, we eliminate excessive showroom real estate overhead—delivering highest-grade natural and lab-grown stones directly from certified vaults to your door.
          </p>
        </div>
      </section>

      {/* The 4 Tenets */}
      <section className="bg-[var(--color-stone)] py-16 sm:py-24">
        <div className="page">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-slate)]">
              Our Structural Tenets
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-[var(--color-ink)]">
              The Architecture of Integrity
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[var(--color-line)] bg-white p-8">
              <div className="size-12 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-loupe)] mb-6">
                <Award className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Dual Lab Certification
              </h3>
              <p className="mt-3 text-xs text-[var(--color-slate)] leading-relaxed">
                Zero uncertified diamonds. Every loose specimen is graded by the Gemological Institute of America (GIA) or International Gemological Institute (IGI).
              </p>
            </div>

            <div className="border border-[var(--color-line)] bg-white p-8">
              <div className="size-12 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-loupe)] mb-6">
                <Eye className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Forensic Girdle Inscription
              </h3>
              <p className="mt-3 text-xs text-[var(--color-slate)] leading-relaxed">
                Every stone bears a microscopic laser inscription on its girdle matching its official laboratory dossier, verified prior to shipment.
              </p>
            </div>

            <div className="border border-[var(--color-line)] bg-white p-8">
              <div className="size-12 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-loupe)] mb-6">
                <ShieldCheck className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Zero Showroom Markup
              </h3>
              <p className="mt-3 text-xs text-[var(--color-slate)] leading-relaxed">
                We operate as a digital vault. Without retail rent, commission sales desks, or display liabilities, our pricing reflects wholesale gemological value.
              </p>
            </div>

            <div className="border border-[var(--color-line)] bg-white p-8">
              <div className="size-12 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-loupe)] mb-6">
                <Truck className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Armoured Transit Escort
              </h3>
              <p className="mt-3 text-xs text-[var(--color-slate)] leading-relaxed">
                All dispatches are encased in serialized tamper-evident security bags and transported via Sequel Logistics and Malca-Amit with 100% door-to-door insurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="bg-white py-16 sm:py-24 border-b border-[var(--color-line)]">
        <div className="page max-w-4xl">
          <div className="space-y-8 text-base text-[var(--color-slate)] leading-relaxed font-light">
            <h2 className="font-serif text-3xl font-medium text-[var(--color-ink)] not-italic">
              From Surat Lapidaries to Your Personal Collection
            </h2>
            <p>
              Surat and Mumbai represent the world’s pinnacle diamond cutting and trading hubs. By establishing direct pipeline access to master lapidaries, Keian Luxandor bypasses multi-tier intermediary markups. Each rough crystal or CVD/HPHT lab diamond is cut under strict optical metrology tolerances.
            </p>
            <p>
              Before any loose stone is cleared for dispatch, it passes through our central Fulfillment &amp; Inspection Desk. Our gemologists verify carat weight on calibrated Mettler Toledo micro-balances, inspect clarity plots under 10x achromatic triplet loupes, and match the laser inscription directly with GIA/IGI central digital registries.
            </p>

            <div className="border-l-2 border-[var(--color-ink)] pl-6 py-2 my-8">
              <blockquote className="font-serif text-xl text-[var(--color-ink)] italic font-normal">
                &ldquo;We treat our clients not merely as retail consumers, but as analytical appraisers evaluating optical fire, scintillation vectors, and certified permanence.&rdquo;
              </blockquote>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/diamonds/natural"
                className="inline-flex items-center justify-center gap-2 rounded-none bg-[var(--color-ink)] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[var(--color-loupe)] transition-colors"
              >
                Browse Natural Diamonds
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-none border border-[var(--color-line)] bg-white px-6 py-3.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
              >
                Consult Private Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
