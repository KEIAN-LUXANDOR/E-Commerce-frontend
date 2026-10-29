import * as React from "react";
import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account | Keian Luxandor",
  description: "Create your personal Keian Luxandor diamond client account.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-stone px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-line bg-surface p-8 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-loupe/5 blur-3xl" />

        <div className="text-center space-y-2">
          {/* Origin UI style organic accent badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-stone px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate">
            <span className="size-1.5 rounded-full bg-loupe animate-pulse" />
            Client Atelier Access
          </div>

          <h1 className="mt-3 text-center text-3xl sm:text-4xl font-serif font-medium tracking-tight text-ink">
            Create Account
          </h1>
          <p className="text-center text-sm text-slate max-w-sm mx-auto leading-relaxed">
            Reserve certified loose diamonds, track vault consignments, and access gemological dossiers.
          </p>
        </div>

        <RegisterForm />

        {/* TailGrids luxury trust footer */}
        <div className="pt-6 border-t border-line flex items-center justify-center gap-6 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-ok" />
            DPDP Act Compliant
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-brand-accent" />
            Direct Atelier Pricing
          </span>
        </div>
      </div>
    </div>
  );
}