/**
 * Editorial Client Authentication Layout
 * Matches Stitch Screens:
 * 420bc39b8bc746f2bd93a9117579af1e,
 * 09b90593d02641d19ec4c81699a351c8,
 * 6dee9ec5fc364791aed576f77449882d
 */

import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="auth-shell relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(233,239,234,0.9),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(245,240,232,0.95),transparent_42%),var(--color-paper)] px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute left-[-8rem] top-[-8rem] size-72 rounded-full bg-platinum/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] size-80 rounded-full bg-stone/80 blur-3xl" />

      {/* Portal heading */}
      <header className="relative mb-8 w-full text-center sm:mb-9">
        <Link
          href="/"
          className="group inline-flex flex-col items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-loupe)] focus-visible:ring-offset-4"
        >
          <span className="block font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-[var(--color-slate)] transition-colors group-hover:text-[var(--color-ink)]">
            Keian Luxandor <span aria-hidden="true">&bull;</span> High Diamond Atelier
          </span>

          <span className="mt-1 font-serif text-2xl font-normal leading-tight tracking-tight text-[var(--color-ink)] sm:text-[1.8rem]">
            Private Client Portal
          </span>
        </Link>
      </header>

      {/* Single authentication card */}
      <main className="auth-squircle relative w-full max-w-md min-w-0 border border-white/80 bg-white/95 p-5 shadow-[0_24px_70px_-28px_rgba(31,58,50,0.28)] backdrop-blur-xl sm:p-8">
        {children}
      </main>

      {/* Security footer */}
      <footer
        aria-label="Security information"
        className="mt-6 flex w-full max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[var(--color-muted)] sm:mt-7 sm:text-[11px]"
      >
        <span className="inline-flex items-center gap-1.5">
          <Lock
            aria-hidden="true"
            className="size-3.5 shrink-0 text-[var(--color-loupe)]"
          />
          TLS 1.3 Encrypted
        </span>

        <span className="inline-flex items-center gap-1.5 sm:border-l sm:border-[var(--color-line-dark)] sm:pl-4">
          <ShieldCheck
            aria-hidden="true"
            className="size-3.5 shrink-0 text-[var(--color-loupe)]"
          />
          Secure Razorpay Payments
        </span>
      </footer>
    </div>
  );
}