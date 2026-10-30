"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, HelpCircle,  ArrowRight } from "lucide-react";

interface FaqItem {
  id: string;
  category: "certification" | "transit" | "returns" | "payment";
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "cert-1",
    category: "certification",
    question: "How do I independently verify a diamond's GIA or IGI certificate?",
    answer:
      "Every loose diamond listed in our catalog features a unique GIA or IGI report number. You can verify the report directly on the issuing laboratory's official website (gia.edu or igi.org) using their Report Check tool. All facet percentages, carat weight to 1/100th precision, and inclusion plots on our product pages match the central laboratory database.",
  },
  {
    id: "cert-2",
    category: "certification",
    question: "Is every loose diamond laser-inscribed on its girdle?",
    answer:
      "Yes. 100% of our diamonds bear a microscopic laser inscription on the girdle displaying the laboratory logo and certificate serial number. Prior to dispatch, our gemologists verify this inscription under 10x magnification as mandatory Step 1 of our fulfillment checklist.",
  },
  {
    id: "cert-3",
    category: "certification",
    question: "What is the difference between natural and lab-grown diamonds?",
    answer:
      "Chemically, physically, and optically, natural and lab-grown diamonds are identical—both are pure crystallized carbon in an isometric-hexoctahedral crystal lattice. Natural diamonds formed deep in the Earth's mantle over billions of years, while lab diamonds are synthesized via CVD or HPHT processes over weeks. Both are independently graded on identical 4Cs scales.",
  },
  {
    id: "transit-1",
    category: "transit",
    question: "How are high-value diamonds delivered safely across India?",
    answer:
      "Delivery is free across India. Every diamond is sealed and shipped with a courier suited to high-value parcels, and we email you the tracking details once it is dispatched. Someone must be at the address to sign for it.",
  },
  {
    id: "transit-2",
    category: "transit",
    question: "Is transit insurance included in the purchase price?",
    answer:
      "Yes. Comprehensive door-to-door transit insurance covering 100% of the replacement value is included with every order at no extra fee. Liability transfers to you only upon authorized physical delivery and signature.",
  },
  {
    id: "transit-3",
    category: "transit",
    question: "How long does domestic delivery take?",
    answer:
      "Metropolitan destinations (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata) are typically fulfilled within 2 to 4 business days following our laboratory inspection. Tier-2 and Tier-3 cities receive delivery within 3 to 6 business days.",
  },
  {
    id: "returns-1",
    category: "returns",
    question: "What is the 30-day return policy?",
    answer:
      "You have 30 days from delivery to return a diamond. If the loose diamond does not meet your aesthetic or gemological expectations, you may initiate a return. The stone must be in its original loose, unset condition accompanied by its intact physical GIA or IGI grading dossier.",
  },
  {
    id: "returns-2",
    category: "returns",
    question: "How does the forensic return verification process work?",
    answer:
      "Upon receipt at our central laboratory, our Senior Gemologist performs a 4-point forensic check: calibrated micro-balance weight verification, girdle laser inscription authentication under 10x loupe, facet inclusion mapping, and UV fluorescence verification. Once confirmed, a 100% refund is released within 48 hours.",
  },
  {
    id: "payment-1",
    category: "payment",
    question: "What currency are prices in?",
    answer:
      "All prices are shown and charged in US dollars (USD). An invoice is provided with every order.",
  },
  {
    id: "payment-2",
    category: "payment",
    question: "Can I pay via RTGS / NEFT bank wire for high-value diamonds?",
    answer:
      "Yes. For orders exceeding standard credit card limits, we support direct institutional RTGS/NEFT bank wire transfers with an immutable transaction hold. Contact our Digital Concierge for dedicated treasury bank details.",
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "cert-1": true,
    "transit-1": true,
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        !search.trim() ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="w-full bg-white text-[var(--color-ink)]">
      {/* Header */}
      <section className="border-b border-[var(--color-line)] bg-white py-12">
        <div className="page">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-semibold">FAQ</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-slate)]">
              Institutional Reference &amp; Transparency
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Frequently asked <span className="italic">questions</span>
            </h1>
            <p className="mt-3 text-base text-[var(--color-slate)] leading-relaxed font-light">
              Clear answers regarding our GIA/IGI certification protocols, delivery, 30-day returns, and tax transparency.
            </p>
          </div>

          {/* Search Input */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted)]" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search certification, delivery, returns, or payment..."
                className="w-full h-12 border border-[var(--color-line)] bg-[var(--color-stone)] pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-loupe)] focus:bg-white focus:outline-none rounded-[3px]"
              />
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Questions" },
              { id: "certification", label: "Certification & Grading" },
              { id: "transit", label: "Delivery" },
              { id: "returns", label: "30-Day Returns & Forensics" },
              { id: "payment", label: "Payment & Currency" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors rounded-[3px] ${
                  selectedCategory === cat.id
                    ? "bg-[var(--color-ink)] text-white"
                    : "border border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:bg-[var(--color-stone)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion Arena */}
      <section className="bg-[var(--color-stone)] py-16">
        <div className="page max-w-3xl">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center bg-white border border-[var(--color-line)] p-8">
              <HelpCircle className="mx-auto size-10 text-[var(--color-muted)] mb-3" />
              <h3 className="font-serif text-lg font-medium">No matching questions found</h3>
              <p className="mt-1 text-xs text-[var(--color-slate)]">
                Try searching with different terms or consult our concierge directly.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block border border-[var(--color-line)] bg-[var(--color-stone)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] hover:bg-[var(--color-stone-deep)]"
              >
                Contact Concierge
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-line)] border border-[var(--color-line)] bg-white">
              {filteredFaqs.map((faq) => {
                const isOpen = Boolean(openIds[faq.id]);
                return (
                  <div key={faq.id} className="transition-colors hover:bg-[var(--color-stone)]/30">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-lg font-medium text-[var(--color-ink)] pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`size-4 text-[var(--color-slate)] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-[var(--color-loupe)]" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0 text-sm text-[var(--color-slate)] leading-relaxed font-light border-t border-[var(--color-line)]/50 bg-[var(--color-stone)]/20">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Need More Assistance Banner */}
          <div className="mt-12 border border-[var(--color-line)] bg-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Have a specific gemological question?
              </h3>
              <p className="mt-1 text-xs text-[var(--color-slate)]">
                Our gemologists are available on WhatsApp for direct stone analysis and high-resolution cert scans.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-none bg-[var(--color-ink)] px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[var(--color-loupe)] transition-colors shrink-0"
            >
              Contact Concierge
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
