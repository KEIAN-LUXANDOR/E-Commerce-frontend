import * as React from "react";
import type { Metadata } from "next";
import { AddressBook } from "@/components/auth/AddressBook";

export const metadata: Metadata = {
  title: "Insured Delivery Addresses | Collector Portal | Keian Luxandor",
  description: "Manage verified shipping destinations for armoured courier handoff.",
};

export default function AccountAddressesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--color-ink)]">Insured Delivery Destinations</h2>
        <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
          Registered residential and private vault addresses eligible for armoured escort dispatch.
        </p>
      </div>

      <div className="border border-[var(--color-line)] bg-white p-6 md:p-8">
        <AddressBook />
      </div>
    </div>
  );
}
