"use client";

import { useState } from "react";
import { ShoppingCart, FileText, Package } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  
  const handleInvoice = () => {
    // Corrected to object format
    showToast("Generating invoice...", { tone: "default" });
  };

  const handleShip = () => {
    // Corrected to object format
    showToast("Marking as shipped...", { tone: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Order {params.id}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleInvoice}
            className="inline-flex items-center justify-center border border-line bg-surface px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink hover:bg-platinum transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" /> Invoice
          </button>
          <button
            onClick={handleShip}
            className="inline-flex items-center justify-center bg-ink px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
          >
            <Package className="mr-2 h-4 w-4" /> Ship
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line p-12 text-center text-slate">
        <p>Order details will appear here.</p>
      </div>
    </div>
  );
}