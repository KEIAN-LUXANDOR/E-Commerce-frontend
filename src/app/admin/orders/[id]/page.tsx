"use client";

/**
 * Detailed Order Dossier & Forensic Metrology Audit
 * Route: /admin/orders/[id]
 *
 * Immutable chain-of-custody ledger for high-value diamond transactions:
 *   - Financial escrow records & GST invoice metadata
 *   - Forensic gemological inspection logs & operator signature
 *   - Armoured transit GPS timestamp trail
 *   - SHA-256 cryptographic verification seal
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 */

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Printer, Lock, Download, Award, FileText } from "lucide-react";
import { formatINR } from "@/lib/format";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";

interface AuditEvent {
  timestamp: string;
  stage: string;
  operator: string;
  notes: string;
  hash: string;
}

const SAMPLE_EVENTS: AuditEvent[] = [
  {
    timestamp: "2026-10-21 14:10:02 IST",
    stage: "PAYMENT_LOCKED",
    operator: "Razorpay Gateway Webhook",
    notes: "Payment of ₹9,27,000 captured via HDFC NetBanking. Escrow lock placed on inventory #dia-round-200.",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    timestamp: "2026-10-21 16:35:18 IST",
    stage: "METROLOGY_INSPECTION",
    operator: "Elena Vance, GG (Staff L4)",
    notes: "10x Loupe verified. Girdle laser inscription 'GIA 2287654321' matched. Culet pointed, symmetry excellent.",
    hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  },
  {
    timestamp: "2026-10-21 17:02:40 IST",
    stage: "SEALED_TAMPER_POUCH",
    operator: "Kabir Desai (Vault Custodian L3)",
    notes: "Original GIA dossier enclosed in leather sleeve. Sealed in tamper-evident cassette #SEAL-IN-984421.",
    hash: "a45b8701cd2034e34f6690fa2ef0e74f6797b5e468ff83b19280b2a59a721612",
  },
  {
    timestamp: "2026-10-21 18:15:55 IST",
    stage: "ARMED_ESCORT_HANDOVER",
    operator: "Sequel Logistics Armed Officer (ID #SEQ-8819)",
    notes: "Dual-custody biometric sign-off. AWB #SEQ-IN-9812401 issued. Armoured transport vehicle #MH-01-EQ-9102.",
    hash: "f7ff9e8b7bb2e09b70935a5d785e0cc5d9d0abf0a4f54eb13dd88a6d7ec78ac3",
  },
];

function OrderDossierInspectionContent() {
  const params = useParams();
  const orderId = typeof params.id === "string" ? params.id : "KL-2026-98214";

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-slate)] hover:text-[var(--color-ink)] mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-[var(--color-ink)]">
              Order Dossier {orderId}
            </h1>
            <span className="font-mono text-xs uppercase px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200">
              In Armoured Transit
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              showToast(
                `Printing comprehensive metrology dossier for ${orderId}...`,
                "info"
              )
            }
            className="flex items-center gap-2 font-mono text-xs uppercase"
          >
            <Printer className="size-3.5" />
            <span>Print Dossier</span>
          </Button>
          <Button
            onClick={() =>
              showToast(
                `Retrieving signed customs waybill for ${orderId}...`,
                "info"
              )
            }
            className="flex items-center gap-2 font-mono text-xs uppercase"
          >
            <Download className="size-3.5" />
            <span>Waybill (PDF)</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[var(--color-line)] bg-white p-5 space-y-2">
          <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
            Client &amp; Destination
          </span>
          <p className="font-serif text-lg text-[var(--color-ink)]">Aarav Mehta</p>
          <p className="font-mono text-xs text-[var(--color-slate)]">Flat 12B, Oberoi Garden Estate</p>
          <p className="font-mono text-xs text-[var(--color-slate)]">Mumbai, Maharashtra 400072</p>
          <p className="font-mono text-[11px] text-[var(--color-muted)] pt-1">Phone: +91 98765 43210</p>
        </div>

        <div className="border border-[var(--color-line)] bg-white p-5 space-y-2">
          <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
            Diamond Metrology Spec
          </span>
          <p className="font-serif text-lg text-[var(--color-ink)]">2.00 ct Round Solitaire</p>
          <p className="font-mono text-xs text-[var(--color-slate)]">Color D &bull; Clarity VVS1 &bull; Excellent Cut</p>
          <p className="font-mono text-xs text-[var(--color-slate)]">Laboratory: GIA Report #2287654321</p>
          <p className="font-mono text-[11px] text-emerald-800 flex items-center gap-1 pt-1">
            <ShieldCheck className="size-3" /> Girdle Laser Inscription Verified
          </p>
        </div>

        <div className="border border-[var(--color-line)] bg-white p-5 space-y-2">
          <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
            Financial &amp; Escrow
          </span>
          <p className="font-mono text-2xl font-bold text-[var(--color-ink)]">
            {formatINR(92700000)}
          </p>
          <p className="font-mono text-xs text-[var(--color-slate)]">Net Subtotal: ₹9,00,000</p>
          <p className="font-mono text-xs text-[var(--color-slate)]">GST 3%: ₹27,000</p>
          <p className="font-mono text-[11px] text-[var(--color-muted)] pt-1">HDFC Gateway Ref: PAY-91024-HDFC</p>
        </div>
      </div>

      {/* Immutable Event Ledger */}
      <div className="border border-[var(--color-line)] bg-white shadow-sm overflow-hidden">
        <div className="bg-[var(--color-stone)] border-b border-[var(--color-line)] p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-[var(--color-ink)]" />
            <h2 className="font-serif text-lg text-[var(--color-ink)]">
              Chain-of-Custody Cryptographic Ledger
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-slate)]">
            Tamper-Evident SHA-256 Hashes
          </span>
        </div>

        <div className="divide-y divide-[var(--color-line)]">
          {SAMPLE_EVENTS.map((event, idx) => (
            <div key={idx} className="p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                  {event.stage}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-slate)]">
                  {event.timestamp}
                </span>
              </div>
              <p className="font-sans text-xs text-[var(--color-slate)] leading-relaxed">
                {event.notes}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1 font-mono text-[10px] text-[var(--color-muted)]">
                <span>Verified by: <strong className="text-[var(--color-ink)]">{event.operator}</strong></span>
                <span className="font-mono text-[9px] truncate max-w-xs md:max-w-md">
                  SHA-256: {event.hash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDossierInspectionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-stone)] flex items-center justify-center p-8">
          <p className="font-mono text-xs uppercase text-[var(--color-slate)]">
            Loading order dossier &amp; metrology audit trail...
          </p>
        </div>
      }
    >
      <OrderDossierInspectionContent />
    </React.Suspense>
  );
}
