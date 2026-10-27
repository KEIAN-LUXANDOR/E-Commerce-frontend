"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/lib/stores";

export function DiamondList() {
  const [error] = useState("");

  useEffect(() => {
    if (error) {
      showToast(error, { tone: "error" });
    }
  }, [error]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-ink">Inventory Diamonds</h2>
      <div className="border border-line bg-surface p-6 text-slate text-sm">
        Diamond inventory listing table.
      </div>
    </div>
  );
}

export default DiamondList;