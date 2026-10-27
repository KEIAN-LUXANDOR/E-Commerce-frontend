"use client";

import { showToast } from "@/lib/stores";

export function DiamondForm() {
  const handleSave = () => {
    showToast("Failed to save diamond", { tone: "error" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-ink">Diamond Form</h2>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-ink text-white text-xs uppercase tracking-widest"
      >
        Save
      </button>
    </div>
  );
}

export default DiamondForm;