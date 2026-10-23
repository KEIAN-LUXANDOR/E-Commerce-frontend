import * as React from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Operations & Vault Desk | Keian Luxandor",
  description:
    "Internal fulfillment, packing desk, diamond metrology audit, and armoured logistics dispatcher.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[var(--color-stone)]" />}>
      <AdminShell>{children}</AdminShell>
    </React.Suspense>
  );
}
