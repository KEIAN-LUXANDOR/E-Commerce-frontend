"use client";

import Link from "next/link";

export function CompareView() {
  return (
    <div className="page py-16">
      <h1 className="text-2xl font-medium text-ink">Browse Diamonds</h1>
      <p className="mt-2 text-sm text-slate">
        Explore our certified natural and lab-grown loose diamonds.
      </p>
      <Link
        href="/diamonds"
        className="mt-6 inline-flex h-11 items-center bg-ink px-6 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep"
      >
        Shop Diamonds
      </Link>
    </div>
  );
}