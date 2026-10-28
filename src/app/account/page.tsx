import * as React from "react";
import type { Metadata } from "next";
import { ProfileEditor } from "@/components/account/ProfileEditor";

export const metadata: Metadata = {
  title: "Profile | Your account | Keian Luxandor",
  description: "Manage your personal information and preferences.",
};

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="font-serif text-3xl font-normal text-ink">Personal Profile</h2>
        <p className="mt-1 text-sm text-slate">Manage your client credentials and contact details.</p>
      </div>
      <ProfileEditor />
    </div>
  );
}