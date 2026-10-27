"use client";

import { Lock, Download } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function VaultLedgerPage() {
  const handleExport = () => {
    showToast("Exporting ledger...", { tone: "default" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
          <Lock className="h-6 w-6" />
          Vault Ledger
        </h1>
        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center bg-ink px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
        >
          <Download className="mr-2 h-4 w-4" /> Export
        </button>
      </div>

      <div className="bg-surface border border-line p-12 text-center text-slate">
        <p>Vault transaction history will appear here.</p>
      </div>
    </div>
  );
}