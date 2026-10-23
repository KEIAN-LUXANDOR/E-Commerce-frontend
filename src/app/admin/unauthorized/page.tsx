import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Access Restricted | Keian Luxandor Operations Desk",
  description: "Security clearance level violation on Keian Luxandor luxury diamond operations deck.",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-[var(--color-ink)]">
      <div className="max-w-xl w-full border border-[var(--color-line)] bg-white p-8 sm:p-12 text-center shadow-none">
        <div className="mx-auto size-16 bg-[#f7e9e9] text-[#a23b3b] grid place-items-center mb-6">
          <Lock className="size-8" aria-hidden="true" />
        </div>

        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#a23b3b] font-semibold block mb-2">
          Clearance Level Violation · Security Code 403
        </span>

        <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Access Restricted
        </h1>

        <p className="mt-4 text-xs font-mono text-[var(--color-slate)] leading-relaxed">
          Your active staff session does not possess the requisite clearance credentials (L0–L5) to access this metrology protocol, ledger endpoint, or tamper-seal action.
        </p>

        {/* Clearance Level Guide */}
        <div className="mt-8 border border-[var(--color-line)] bg-[var(--color-stone)]/40 p-4 text-left font-mono text-[11px] space-y-2">
          <span className="text-[10px] uppercase font-bold text-[var(--color-ink)] block border-b border-[var(--color-line)] pb-1">
            Institutional Clearance Matrix:
          </span>
          <div className="flex justify-between text-[var(--color-slate)]">
            <span>L1 · Customer Concierge:</span>
            <span>Inquiries &amp; Customer View</span>
          </div>
          <div className="flex justify-between text-[var(--color-slate)]">
            <span>L2 · Dispatch Escort:</span>
            <span>AWB Inbound &amp; Outbound Verification</span>
          </div>
          <div className="flex justify-between text-[var(--color-ink)] font-semibold">
            <span>L3 · Certifying Gemologist:</span>
            <span>Laser Inscription Loupe Inspection &amp; Bag Sealing</span>
          </div>
          <div className="flex justify-between text-[var(--color-ink)] font-semibold">
            <span>L4 · Vault Custodian:</span>
            <span>Vault Move Authorization &amp; Safe Allocation</span>
          </div>
          <div className="flex justify-between text-[var(--color-ink)] font-bold">
            <span>L5 · Chief Gemologist:</span>
            <span>Full System Architecture &amp; Refund Approval</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/admin/packing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white px-6 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[var(--color-loupe)] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Return to Packing Desk
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--color-line)] bg-white text-[var(--color-ink)] px-6 py-3 text-xs font-mono uppercase tracking-wider hover:bg-[var(--color-stone)] transition-colors"
          >
            Operations Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
