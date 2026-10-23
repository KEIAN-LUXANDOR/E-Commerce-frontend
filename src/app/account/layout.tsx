import * as React from "react";
import type { Metadata } from "next";
import { AccountNav } from "@/components/account/account-nav";

export const metadata: Metadata = {
  title: "Collector Portal | Keian Luxandor",
  description:
    "Manage your private collector dossier, track insured diamond shipments, and access official GIA/IGI laboratory archives.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner Header */}
      <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-slate)]">
            Keian Luxandor &bull; Private Client Services
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-ink)] mt-1.5">
            Collector Portal & Vault
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <React.Suspense fallback={<div className="h-10 bg-[var(--color-stone)]" />}>
                <AccountNav />
              </React.Suspense>
            </div>
          </div>

          {/* Subpage Content */}
          <div className="lg:col-span-3 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
