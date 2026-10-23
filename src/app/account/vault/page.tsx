"use client";

/**
 * Client Account Portfolio & Gemological Vault
 * Matches Stitch Screen: f6e0984beb76479e96922a3e176884e2
 * Route: /account/vault
 *
 * Implements:
 *   - Client portfolio KPI cards: Total Valuation, Carats Held, In-Transit Value, Registered Vault
 *   - High-priority active consignment alert linking to /order-tracking
 *   - Specimen dossiers with 20x macro plots, GIA/IGI certificate links, laser inscriptions
 *   - Replacement valuation certificate request
 *   - Dedicated senior gemologist concierge line
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Crisp tabular typography with Hanken Grotesk / Jost Variable.
 */

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Download,
  ExternalLink,
  ShieldCheck,
  FileText,
  Truck,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
  MessageCircle,
} from "lucide-react";
import { showToast } from "@/lib/stores";
import { site, whatsappLink } from "@/lib/site";

interface VaultDossier {
  id: string;
  diamondTitle: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  lab: "GIA" | "IGI";
  reportNumber: string;
  laserInscription: string;
  issueDate: string;
  acquiredDate: string;
  acquisitionValue: string;
  currentValuation: string;
  status: "In Custody" | "In Armored Transit";
}

const VAULT_DOSSIERS: VaultDossier[] = [
  {
    id: "vlt-01",
    diamondTitle: "2.00 ct Round Brilliant Solitaire",
    shape: "Round",
    carat: 2.0,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    lab: "GIA",
    reportNumber: "2287654321",
    laserInscription: "GIA 2287654321",
    issueDate: "10 Aug 2026",
    acquiredDate: "21 Oct 2026",
    acquisitionValue: "₹9,27,000",
    currentValuation: "₹9,45,000",
    status: "In Custody",
  },
  {
    id: "vlt-02",
    diamondTitle: "1.52 ct Emerald Cut Investment Specimen",
    shape: "Emerald",
    carat: 1.52,
    color: "E",
    clarity: "VS1",
    cut: "Superb",
    lab: "GIA",
    reportNumber: "6190284712",
    laserInscription: "GIA 6190284712",
    issueDate: "28 Jun 2026",
    acquiredDate: "14 Sep 2026",
    acquisitionValue: "₹4,45,000",
    currentValuation: "₹4,60,000",
    status: "In Custody",
  },
  {
    id: "vlt-03",
    diamondTitle: "1.02 ct Oval Brilliant Lab-Grown Diamond",
    shape: "Oval",
    carat: 1.02,
    color: "F",
    clarity: "VS1",
    cut: "Excellent",
    lab: "IGI",
    reportNumber: "LG61234567",
    laserInscription: "IGI LG61234567 KEIAN",
    issueDate: "15 Oct 2026",
    acquiredDate: "22 Oct 2026",
    acquisitionValue: "₹4,73,200",
    currentValuation: "₹4,73,200",
    status: "In Armored Transit",
  },
];

export default function AccountVaultPage() {
  function handleDownloadCert(reportNumber: string, lab: string) {
    showToast(`Downloading official ${lab} certificate PDF for #${reportNumber}...`, "info");
  }

  function handleRequestAppraisal(title: string) {
    showToast(`Appraisal dossier requested for ${title}. Sent to your registered email.`, "info");
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Title & Patron Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-loupe)] block">
            Client Dossier KL-CL-1042
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-ink)]">Private Diamond Portfolio</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[var(--color-stone)] border border-[var(--color-line)] font-mono text-xs text-[var(--color-ink)] font-semibold uppercase">
            Atelier High-Diamond Patron
          </span>
          <span className="font-mono text-xs text-[var(--color-muted)]">Member since Oct 2024</span>
        </div>
      </div>

      {/* 4 Portfolio Valuation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[var(--color-line)] bg-white p-5 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Total Portfolio Value
          </span>
          <p className="font-serif text-2xl font-bold text-[var(--color-ink)]">₹18,45,200</p>
          <span className="font-mono text-[10px] text-emerald-700 flex items-center gap-1">
            +₹33,000 (+1.8%) Index Gain
          </span>
        </div>

        <div className="border border-[var(--color-line)] bg-white p-5 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Total Certified Carats
          </span>
          <p className="font-serif text-2xl font-bold text-[var(--color-ink)]">4.54 ct</p>
          <span className="font-mono text-[10px] text-[var(--color-slate)]">Across 3 authenticated specimens</span>
        </div>

        <div className="border border-[var(--color-line)] bg-white p-5 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            In-Transit Armored Value
          </span>
          <p className="font-serif text-2xl font-bold text-[var(--color-loupe)]">₹4,73,200</p>
          <span className="font-mono text-[10px] text-[var(--color-slate)]">Under Lloyd&apos;s Policy Cover</span>
        </div>

        <div className="border border-[var(--color-line)] bg-white p-5 space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
            Registered Vault Sector
          </span>
          <p className="font-serif text-xl font-bold text-[var(--color-ink)]">Pune Sector 411</p>
          <span className="font-mono text-[10px] text-emerald-700">Identity &amp; Biometrics Verified</span>
        </div>
      </div>

      {/* Active Armored Transit Alert Banner */}
      <div className="border border-blue-200 bg-blue-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Truck className="size-6 text-[var(--color-loupe)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 bg-[var(--color-loupe)] text-white">
                Active Consignment
              </span>
              <p className="font-serif text-base font-semibold text-[var(--color-ink)]">
                Dossier #AD-2026-000123 En Route
              </p>
            </div>
            <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
              1.02 ct Oval Brilliant Lab-Grown Diamond currently in Brink&apos;s Armored Transit under satellite
              monitoring. Expected delivery: 24 Oct 2026.
            </p>
          </div>
        </div>
        <Link
          href="/order-tracking?orderId=AD-2026-000123"
          className="btn btn-primary text-xs uppercase tracking-wider py-2.5 px-6 whitespace-nowrap inline-flex items-center gap-2 shrink-0"
        >
          <span>Track Satellite GPS</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Acquired Specimen Dossiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="font-serif text-xl text-[var(--color-ink)]">Vault Asset Ledger &amp; Lab Certificates</h3>
          <span className="font-mono text-xs text-[var(--color-muted)]">3 Specimens Held</span>
        </div>

        <div className="space-y-4">
          {VAULT_DOSSIERS.map((dossier) => {
            const isTransit = dossier.status === "In Armored Transit";

            return (
              <div
                key={dossier.id}
                className="border border-[var(--color-line)] bg-white p-6 transition-all hover:border-[var(--color-line-dark)]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[var(--color-stone)] border border-[var(--color-line)] text-[var(--color-ink)]">
                        {dossier.lab} {dossier.reportNumber}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 ${
                          isTransit
                            ? "bg-blue-100 text-[var(--color-loupe)] font-semibold"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {dossier.status}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg text-[var(--color-ink)]">{dossier.diamondTitle}</h4>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-6 text-right">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[var(--color-muted)] block">Acquired Value</span>
                      <span className="font-mono text-sm font-medium text-[var(--color-slate)]">{dossier.acquisitionValue}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[var(--color-muted)] block">Current Appraisal</span>
                      <span className="font-serif text-lg font-bold text-[var(--color-ink)]">{dossier.currentValuation}</span>
                    </div>
                  </div>
                </div>

                {/* Specs Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 py-4 bg-[var(--color-stone)]/50 p-4 my-4 border border-[var(--color-line)] text-center text-xs font-mono">
                  <div>
                    <span className="text-[var(--color-muted)] text-[10px] uppercase block">Carat Weight</span>
                    <span className="font-semibold text-[var(--color-ink)]">{dossier.carat.toFixed(2)} ct</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-muted)] text-[10px] uppercase block">Colour</span>
                    <span className="font-semibold text-[var(--color-ink)]">{dossier.color}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-muted)] text-[10px] uppercase block">Clarity</span>
                    <span className="font-semibold text-[var(--color-ink)]">{dossier.clarity}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-muted)] text-[10px] uppercase block">Cut Polish/Sym</span>
                    <span className="font-semibold text-[var(--color-ink)]">{dossier.cut}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-muted)] text-[10px] uppercase block">Girdle Inscription</span>
                    <span className="font-semibold text-emerald-800 text-[11px] truncate block" title={dossier.laserInscription}>
                      {dossier.laserInscription}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--color-muted)] text-[10px] uppercase block">Acquisition Date</span>
                    <span className="text-[var(--color-slate)]">{dossier.acquiredDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadCert(dossier.reportNumber, dossier.lab)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-stone)] hover:bg-[var(--color-line)] text-[var(--color-ink)] font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      <Download className="size-3.5 text-[var(--color-loupe)]" />
                      <span>{dossier.lab} Certificate PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestAppraisal(dossier.diamondTitle)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--color-line)] hover:border-[var(--color-ink)] text-[var(--color-ink)] font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      <FileText className="size-3.5 text-[var(--color-slate)]" />
                      <span>Insurance Appraisal Dossier</span>
                    </button>
                  </div>

                  <a
                    href={whatsappLink(`Bespoke mounting consultation for ${dossier.diamondTitle} (${dossier.reportNumber})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-loupe)] hover:text-[var(--color-ink)]"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Commission Custom Atelier Setting</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concierge Desk */}
      <div className="border border-[var(--color-line)] bg-white p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PhoneCall className="size-8 text-[var(--color-loupe)] shrink-0" />
          <div>
            <h4 className="font-serif text-lg text-[var(--color-ink)] font-semibold">
              Assigned Senior Gemologist: Dr. Aris Thorne (FGA)
            </h4>
            <p className="font-sans text-xs text-[var(--color-slate)]">
              Direct consultation for portfolio rebalancing, private acquisitions, and vault allocations.
            </p>
          </div>
        </div>
        <a
          href={whatsappLink("Private portfolio advisory with Dr. Aris Thorne")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary text-xs uppercase tracking-wider py-2.5 px-6 inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <MessageCircle className="size-4" />
          <span>Direct WhatsApp Session</span>
        </a>
      </div>
    </div>
  );
}
