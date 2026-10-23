import * as React from "react";
import type { Metadata } from "next";
import { OrderHistory } from "@/components/account/order-history";

export const metadata: Metadata = {
  title: "Acquisitions & Orders | Collector Portal | Keian Luxandor",
  description: "Review current transit status and complete gemological history of your diamond orders.",
};

export default function AccountOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--color-ink)]">Acquisitions & Orders</h2>
        <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
          Real-time physical custody milestones, armoured transport tracking, and historical dossiers.
        </p>
      </div>

      <OrderHistory />
    </div>
  );
}
