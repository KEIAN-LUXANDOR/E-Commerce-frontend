"use client";

import { showToast } from "@/lib/stores";

export function PackingDesk() {
  const handleScan = () => {
    showToast("Scanning order...", { tone: "default" });
  };

  const handleError = () => {
    showToast("Invalid barcode scanned", { tone: "error" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-ink">Packing Desk</h2>
      <div className="flex gap-3">
        <button onClick={handleScan} className="px-4 py-2 bg-ink text-white text-xs uppercase tracking-widest">
          Scan Order
        </button>
        <button onClick={handleError} className="px-4 py-2 bg-out text-white text-xs uppercase tracking-widest">
          Simulate Error
        </button>
      </div>
    </div>
  );
}

export default PackingDesk;