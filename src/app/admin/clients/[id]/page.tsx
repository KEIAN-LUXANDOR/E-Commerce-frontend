"use client";

import * as React from "react";
import { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import { showToast } from "@/lib/stores";
import {
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Save,
} from "lucide-react";

function ClientDossierContent() {
  const params = useParams();
  const clientId = (params?.id as string) ?? "KL-CL-1042";

  const [notes, setNotes] = useState(
    "Prefers Oval and Emerald step cuts above 1.5 carats. Inquired about upcoming GIA D-Flawless natural stone auction batch."
  );

  const handleSaveNotes = () => {
    showToast("Private advisory client notes saved.", "info");
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Title */}
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors mb-3"
        >
          <ArrowLeft className="size-3.5" />
          Back to Client Directory
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
              Collector Portfolio Dossier
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
              Client Dossier #{clientId} — Ananya Singhal
            </h1>
            <p className="text-xs text-[var(--color-slate)] mt-1">
              Verified high-net-worth collector with biometric KYC sign-off and active insured vaults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#e7f0eb] text-[#2f6b4f] text-xs font-mono font-semibold uppercase flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              KYC Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile + Purchases */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Left: Contact & KYC Profile */}
        <div className="border border-[var(--color-line)] bg-white p-6 space-y-6">
          <h2 className="font-serif text-xl font-medium text-[var(--color-ink)]">
            Collector Identification
          </h2>

          <div className="space-y-4 font-mono text-xs border-b border-[var(--color-line)] pb-6">
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Entity / Individual</span>
              <span className="font-sans font-medium text-sm text-[var(--color-ink)] block">
                Mrs. Ananya Singhal
              </span>
              <span className="text-[11px] text-[var(--color-slate)]">Managing Director, Lux Holdings India</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Verified Coordinates</span>
              <span className="text-[var(--color-ink)] block">+91 98201 44890</span>
              <span className="text-[var(--color-muted)] block">ananya.singhal@luxholdings.in</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Vault Delivery Domicile</span>
              <p className="font-sans text-xs text-[var(--color-slate)] mt-1">
                Penthouse 14, Sea Breeze Towers, Bandra West, Mumbai 400050, Maharashtra
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Compliance Records</span>
              <span className="text-[var(--color-ink)] block">PAN: ABCPS1234F (Verified)</span>
              <span className="text-[var(--color-ink)] block">Aadhaar Vault e-Sign: #88921-OK</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
              Private Concierge Sourcing Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-[var(--color-line)] bg-white p-3 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              className="mt-2 inline-flex items-center gap-1.5 bg-[var(--color-ink)] text-white px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-[var(--color-loupe)] transition-colors"
            >
              <Save className="size-3" />
              Save Notes
            </button>
          </div>
        </div>

        {/* Right: Order History */}
        <div className="border border-[var(--color-line)] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-4">
            <div>
              <h2 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                Acquisition History &amp; Orders
              </h2>
              <p className="text-xs text-[var(--color-slate)]">
                Cumulative Purchases: {formatRupees(84500000)} (3 Loose Diamonds)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                orderId: "AD-2026-000088",
                date: "2026-09-15",
                diamond: "1.50 ct Oval D VVS1 (GIA 629014589)",
                pricePaise: 52000000,
                status: "Delivered & Signed",
                carrier: "Sequel Logistics AWB #SEQL-77890",
              },
              {
                orderId: "AD-2026-000062",
                date: "2026-08-04",
                diamond: "1.01 ct Round F VS1 (IGI LG5520198)",
                pricePaise: 32500000,
                status: "Delivered & Signed",
                carrier: "Malca-Amit Escort AWB #MALCA-3321",
              },
            ].map((order) => (
              <div key={order.orderId} className="border border-[var(--color-line)] p-4 bg-[var(--color-stone)]/30 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-ink)]">{order.orderId}</span>
                  <span className="text-[10px] text-[var(--color-muted)]">{order.date}</span>
                </div>
                <p className="font-sans font-medium text-[var(--color-ink)] text-xs">
                  {order.diamond}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-line)]/50">
                  <span className="font-bold text-sm text-[var(--color-ink)]">
                    {formatRupees(order.pricePaise)}
                  </span>
                  <span className="text-[10px] bg-[#e7f0eb] text-[#2f6b4f] px-2 py-0.5 font-semibold uppercase">
                    {order.status}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--color-muted)] block">
                  {order.carrier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDossierPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono">Loading Client Dossier...</div>}>
      <ClientDossierContent />
    </Suspense>
  );
}
