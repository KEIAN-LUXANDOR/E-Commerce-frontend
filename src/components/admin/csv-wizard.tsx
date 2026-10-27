"use client";

import { showToast } from "@/lib/stores";

export function CsvWizard() {
  const handleUpload = () => {
    showToast("CSV processing failed", { tone: "error" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-ink">CSV Import Wizard</h2>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-ink text-white text-xs uppercase tracking-widest"
      >
        Test Upload
      </button>
    </div>
  );
}

export default CsvWizard;