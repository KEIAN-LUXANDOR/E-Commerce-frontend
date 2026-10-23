import * as React from "react";
import type { Metadata } from "next";
import { ProfileEditor } from "@/components/account/profile-editor";

export const metadata: Metadata = {
  title: "Profile & Identity | Collector Portal | Keian Luxandor",
  description: "Manage your legal identity, contact preferences, and dispatch notifications.",
};

export default function AccountProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--color-ink)]">Profile & Identity</h2>
        <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
          Your verified credentials used for insurance coverage and high-value delivery handoff.
        </p>
      </div>

      <ProfileEditor />
    </div>
  );
}
