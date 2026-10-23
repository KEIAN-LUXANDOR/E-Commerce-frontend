import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AccountNav } from "@/components/account/account-nav";

export const metadata: Metadata = {
  title: "Your account | Keian Luxandor",
  description: "Manage your profile, orders, delivery addresses and diamond certificates.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line bg-stone">
        <div className="page py-8 md:py-10">
          <h1 className="font-serif text-4xl font-normal tracking-tight text-ink md:text-5xl">
            Your account
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate md:text-base">
            Update your details, manage delivery addresses, and keep track of your purchases.
          </p>
        </div>
      </header>

      <div className="page grid gap-8 py-8 md:py-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
        <aside className="space-y-6">
          <React.Suspense fallback={<div aria-hidden="true" className="h-40 rounded-md bg-stone" />}>
            <AccountNav />
          </React.Suspense>
          <div className="hidden border-t border-line pt-5 lg:block">
            <p className="text-sm font-medium text-ink">Need a hand?</p>
            <p className="mt-1 text-sm leading-relaxed text-slate">
              We&apos;re happy to help with an order or a question.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-line-dark underline-offset-4 transition-colors hover:decoration-ink"
            >
              Contact us
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
