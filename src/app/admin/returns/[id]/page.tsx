"use client";

import * as React from "react";
import { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import { showToast } from "@/lib/stores";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Award,
  Layers,
  FileText,
} from "lucide-react";

function ReturnInspectionContent() {
  const params = useParams();
  const router = useRouter();
  const rmaId = (params?.id as string) ?? "RET-2026-0042";

  const [step1Weight, setStep1Weight] = useState(true);
  const [step2Laser, setStep2Laser] = useState(true);
  const [step3Inclusions, setStep3Inclusions] = useState(false);
  const [step4Cert, setStep4Cert] = useState(true);
  const [notes, setNotes] = useState("Microscope inspection shows clean facets. Girdle inscription verified under 20x triplet loupe.");
  const [processing, setProcessing] = useState(false);
  const [approved, setApproved] = useState(false);

  const allPassed = step1Weight && step2Laser && step3Inclusions && step4Cert;

  const handleApproveRefund = () => {
    if (!allPassed) {
      showToast("Cannot release refund until all 4 forensic checks pass.", "error");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setApproved(true);
      showToast("Forensic inspection passed. Refund of ₹4,73,200 released via Razorpay Escrow.", "info");
    }, 700);
  };

  const handleRejectRMA = () => {
    showToast("RMA flagged for senior gemologist forensic review.", "error");
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Title */}
      <div>
        <Link
          href="/admin/returns"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors mb-3"
        >
          <ArrowLeft className="size-3.5" />
          Back to Returns Ledger
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
              Forensic Inspection Chamber
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
              Return Inspection Dossier #{rmaId}
            </h1>
            <p className="text-xs text-[var(--color-slate)] mt-1">
              Mandatory 4-stage laboratory verification protocol before return refund authorization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#f6eedf] text-[#8a5a12] text-xs font-mono font-semibold uppercase">
              {approved ? "Refund Released" : "Inspection In Progress"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Inspection Checklist */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Left: Specimen Details */}
        <div className="border border-[var(--color-line)] bg-white p-6 space-y-6">
          <h2 className="font-serif text-xl font-medium text-[var(--color-ink)]">
            Specimen Inward Record
          </h2>

          <div className="space-y-4 font-mono text-xs border-b border-[var(--color-line)] pb-6">
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Order Reference</span>
              <Link href="/admin/orders/AD-2026-000118" className="text-[var(--color-loupe)] hover:underline font-semibold">
                AD-2026-000118
              </Link>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Client Name &amp; Contact</span>
              <span className="text-[var(--color-ink)] block">Aditya Singhania (+91 98450 11223)</span>
              <span className="text-[var(--color-slate)] text-[11px] block">Bengaluru, Karnataka</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Diamond Specification</span>
              <span className="text-[var(--color-ink)] font-bold block">1.02 ct Oval Brilliant Lab-Grown</span>
              <span className="text-[var(--color-slate)] block">Color: F · Clarity: VS1 · Cut: Excellent</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Laboratory Dossier</span>
              <span className="text-[var(--color-ink)] block">IGI Report #LG61234567</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-muted)] uppercase block">Settlement Value</span>
              <span className="text-base font-bold text-[var(--color-ink)] block">
                {formatRupees(47320000)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase block mb-1">
              Customer Stated Reason
            </span>
            <p className="text-xs text-[var(--color-slate)] bg-[var(--color-stone)] p-3 border border-[var(--color-line)] leading-relaxed">
              &ldquo;Upgrading to a 1.50 ct Emerald cut stone from catalog. Stone is completely unset and pristine with original IGI report.&rdquo;
            </p>
          </div>
        </div>

        {/* Right: 4-Point Forensic Protocol Checklist */}
        <div className="border border-[var(--color-line)] bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--color-line)] pb-4">
            <h2 className="font-serif text-2xl font-medium text-[var(--color-ink)]">
              4-Point Forensic Authentication Protocol
            </h2>
            <p className="text-xs text-[var(--color-slate)] mt-1">
              Check all 4 parameters under the inspection loupe to enable refund authorization.
            </p>
          </div>

          <div className="space-y-4">
            {/* Check 1 */}
            <label className="flex items-start gap-3 p-4 border border-[var(--color-line)] bg-[var(--color-stone)]/40 hover:bg-white transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={step1Weight}
                onChange={(e) => setStep1Weight(e.target.checked)}
                className="size-4 mt-0.5 rounded-none border-[var(--color-line-dark)] accent-[var(--color-ink)]"
              />
              <div className="text-xs font-mono">
                <span className="font-semibold text-[var(--color-ink)] block">
                  1. Mettler Toledo Micro-Balance Carat Weight
                </span>
                <span className="text-[var(--color-slate)] font-sans text-xs block mt-0.5">
                  Measured weight: 1.020 ct (Tolerance +/- 0.002 ct confirmed).
                </span>
              </div>
            </label>

            {/* Check 2 */}
            <label className="flex items-start gap-3 p-4 border border-[var(--color-line)] bg-[var(--color-stone)]/40 hover:bg-white transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={step2Laser}
                onChange={(e) => setStep2Laser(e.target.checked)}
                className="size-4 mt-0.5 rounded-none border-[var(--color-line-dark)] accent-[var(--color-ink)]"
              />
              <div className="text-xs font-mono">
                <span className="font-semibold text-[var(--color-ink)] block">
                  2. Microscopic Girdle Laser Inscription
                </span>
                <span className="text-[var(--color-slate)] font-sans text-xs block mt-0.5">
                  10x loupe inspection confirms &ldquo;IGI LG61234567&rdquo; crisply matches central digital database.
                </span>
              </div>
            </label>

            {/* Check 3 */}
            <label className="flex items-start gap-3 p-4 border border-[var(--color-line)] bg-[var(--color-stone)]/40 hover:bg-white transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={step3Inclusions}
                onChange={(e) => setStep3Inclusions(e.target.checked)}
                className="size-4 mt-0.5 rounded-none border-[var(--color-line-dark)] accent-[var(--color-ink)]"
              />
              <div className="text-xs font-mono">
                <span className="font-semibold text-[var(--color-ink)] block">
                  3. Facet Inclusion &amp; Plot Verification
                </span>
                <span className="text-[var(--color-slate)] font-sans text-xs block mt-0.5">
                  Internal pinpoint crystal inclusions exactly match the physical certificate schematic.
                </span>
              </div>
            </label>

            {/* Check 4 */}
            <label className="flex items-start gap-3 p-4 border border-[var(--color-line)] bg-[var(--color-stone)]/40 hover:bg-white transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={step4Cert}
                onChange={(e) => setStep4Cert(e.target.checked)}
                className="size-4 mt-0.5 rounded-none border-[var(--color-line-dark)] accent-[var(--color-ink)]"
              />
              <div className="text-xs font-mono">
                <span className="font-semibold text-[var(--color-ink)] block">
                  4. Physical Certificate Dossier Surrender
                </span>
                <span className="text-[var(--color-slate)] font-sans text-xs block mt-0.5">
                  Original tamper-free IGI physical dossier received in intact archival condition.
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] mb-2">
              Gemologist Inspection Findings &amp; Signature
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-[var(--color-line)] bg-white p-3 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              disabled={!allPassed || approved || processing}
              onClick={handleApproveRefund}
              className="w-full sm:flex-1 h-12 flex items-center justify-center gap-2 bg-[#2f6b4f] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#23533c] transition-colors disabled:opacity-40"
            >
              <CheckCircle2 className="size-4" />
              {approved ? "Refund Released" : processing ? "Authorizing..." : "Authorize Refund (₹4,73,200)"}
            </button>

            <button
              type="button"
              onClick={handleRejectRMA}
              className="w-full sm:w-auto h-12 border border-[var(--color-out)] text-[var(--color-out)] px-5 text-xs font-mono uppercase tracking-wider hover:bg-[var(--color-out)] hover:text-white transition-colors"
            >
              Flag Violation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReturnInspectionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono">Loading Return Inspection Dossier...</div>}>
      <ReturnInspectionContent />
    </Suspense>
  );
}
