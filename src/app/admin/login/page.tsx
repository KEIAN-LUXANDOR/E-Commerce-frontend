"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "@/lib/stores";
import { Lock, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [staffId, setStaffId] = useState("KL-ST-04");
  const [passcode, setPasscode] = useState("••••••••");
  const [clearance, setClearance] = useState("L3");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId.trim()) {
      showToast("Please enter your staff ID.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Welcome, Staff ${staffId}. Level ${clearance} clearance activated.`, "info");
      router.push("/admin");
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-[var(--color-ink)]">
      <div className="max-w-md w-full border border-[var(--color-line)] bg-white p-8 sm:p-10 shadow-none">
        <div className="text-center mb-8">
          <div className="mx-auto size-12 border border-[var(--color-line)] bg-[var(--color-stone)] grid place-items-center text-[var(--color-ink)] mb-3">
            <Lock className="size-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-slate)] block">
            Institutional Operations Deck
          </span>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
            Staff Portal Sign In
          </h1>
          <p className="text-xs text-[var(--color-slate)] mt-1">
            Restricted access for certified gemologists, vault custodians, and logistics officers.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
              Staff Identifier
            </label>
            <input
              type="text"
              required
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. KL-ST-04"
              className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
              Security Passcode / Hardware Key
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-1.5">
              Target Clearance Session
            </label>
            <select
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              className="w-full h-11 border border-[var(--color-line)] bg-white px-3.5 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-loupe)] focus:outline-none"
            >
              <option value="L1">L1 · Customer Concierge</option>
              <option value="L2">L2 · Dispatch Escort</option>
              <option value="L3">L3 · Certifying Gemologist (Loupe Desk)</option>
              <option value="L4">L4 · Vault Safe Custodian</option>
              <option value="L5">L5 · Chief Gemologist &amp; Master Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white text-xs font-mono uppercase tracking-[0.14em] hover:bg-[var(--color-loupe)] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating Session..." : "Authorize Terminal Entry"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--color-line)] text-center">
          <Link
            href="/"
            className="text-[11px] font-mono text-[var(--color-slate)] hover:text-[var(--color-ink)] hover:underline inline-flex items-center gap-1"
          >
            &larr; Return to Public Diamond Boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
