import * as React from "react";
import type { Metadata } from "next";
import { AddressBook } from "@/components/auth/AddressBook";

export const metadata: Metadata = {
  title: "Addresses | Your account | Keian Luxandor",
  description: "Manage the delivery addresses saved to your account.",
};

export default function AccountAddressesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-normal text-ink">Delivery addresses</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
          Save an address for checkout, or update one you already use.
        </p>
      </div>

      <div className="border-y border-line py-6 md:py-8">
        <AddressBook />
      </div>
    </div>
  );
}
