import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

/**
 * Editorial Client Authentication Layout
 * Matches Stitch Screens: 420bc39b8bc746f2bd93a9117579af1e, 09b90593d02641d19ec4c81699a351c8, 6dee9ec5fc364791aed576f77449882d
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col justify-center items-center py-12 sm:py-20 px-4">
      {/* Editorial Header Plate */}
      <div className="text-center mb-8 space-y-2">
        <Link href="/" className="inline-block group">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-slate)] group-hover:text-[var(--color-ink)] transition-colors block">
            Keian Luxandor &bull; High Diamond Atelier
          </span>
          <span className="font-serif text-2xl tracking-tight text-[var(--color-ink)] font-normal">
            Private Client Portal
          </span>
        </Link>
      </div>

      {/* Main Centered Card */}
      <div className="w-full max-w-md bg-white border border-[var(--color-line)] p-8 sm:p-10 shadow-sm relative">
        {children}
      </div>

      {/* Security Footer */}
      <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Lock className="size-3 text-[var(--color-loupe)]" />
          TLS 1.3 Encrypted
        </span>
        <span>&bull;</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-3 text-emerald-700" />
          Vault Key Escrow
        </span>
      </div>
    </div>
  );
}
