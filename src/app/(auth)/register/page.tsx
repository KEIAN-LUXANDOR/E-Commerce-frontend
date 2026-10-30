
import type { Metadata } from "next";
import { Sparkles, ShieldCheck } from "lucide-react";

import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Keian Luxandor",
  description: "Create your personal Keian Luxandor diamond client account.",
};

export default function RegisterPage() {
  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Registration heading */}
      <header className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-stone px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
          <span className="size-1.5 rounded-full bg-loupe" />
          Client Atelier Access
        </div>

        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Create Account
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate">
            Reserve certified loose diamonds, track vault consignments and
            access your gemological dossiers.
          </p>
        </div>
      </header>

      {/* Registration form */}
      <RegisterForm />

      {/* Trust information */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-line pt-5 text-[11px] leading-5 text-muted">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 shrink-0 text-ok" />
          DPDP Act Compliant
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 shrink-0 text-brand-accent" />
          Direct Atelier Pricing
        </span>
      </div>
    </div>
  );
}
