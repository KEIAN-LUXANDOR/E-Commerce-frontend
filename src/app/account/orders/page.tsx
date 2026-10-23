import * as React from "react";
import type { Metadata } from "next";
import { OrderHistory } from "@/components/account/order-history";

export const metadata: Metadata = {
  title: "Orders | Your account | Keian Luxandor",
  description: "Get help with a purchase from Keian Luxandor.",
};

export default function AccountOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-normal text-ink">Your orders</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
          Find order details and delivery updates here.
        </p>
      </div>

      <OrderHistory />
    </div>
  );
}
