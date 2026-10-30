
import type { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Keian Luxandor",
  description: "Sign in to your Keian Luxandor client account.",
};

export default function LoginPage() {
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-7">
      {/* Login heading */}
      <header className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-stone px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
          <span className="size-1.5 rounded-full bg-loupe" />
          Client Authentication
        </div>

        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Sign In
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate">
            Log in to see your orders, saved diamonds and delivery addresses.
          </p>
        </div>
      </header>

      {/* Existing authentication form */}
      <LoginForm />

      {/* Trust information */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-line pt-5 text-[11px] leading-5 text-muted">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 shrink-0 text-ok" />
          End-to-End Encrypted Session
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 shrink-0 text-brand-accent" />
          Verified Vault Records
        </span>
      </div>
    </div>
  );
}
