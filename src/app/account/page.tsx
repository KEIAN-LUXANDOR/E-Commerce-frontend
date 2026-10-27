import * as React from "react";
import type { Metadata } from "next";
import { ProfileEditor } from "@/components/account/ProfileEditor";

export const metadata: Metadata = {
  title: "Profile | Your account | Luxandor",
  description: "Manage your personal information and preferences.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="text-2xl font-serif tracking-widest text-ink">My Account</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        <div className="lg:col-span-1 border-r border-line pr-4 hidden lg:block">
          <nav className="space-y-4">
            <span className="block text-sm font-medium uppercase tracking-widest text-ink">
              Profile
            </span>
            <span className="block text-sm font-medium uppercase tracking-widest text-slate cursor-not-allowed">
              Order History
            </span>
          </nav>
        </div>
        
        <div className="lg:col-span-3">
          <ProfileEditor />
        </div>
      </div>
    </div>
  );
}