"use client";

import { RotateCcw, Check, X } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function ReturnDetailsPage({ params }: { params: { id: string } }) {
  
  const handleApprove = () => {
    // Corrected to object format
    showToast("Return approved.", { tone: "success" });
  };

  const handleReject = () => {
    // Corrected to object format
    showToast("Return rejected.", { tone: "error" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
          <RotateCcw className="h-6 w-6" />
          Return Request {params.id}
        </h1>
        <div className="flex gap-3">
           <button
            onClick={handleReject}
            className="inline-flex items-center justify-center border border-out bg-surface px-4 py-2 text-xs font-medium uppercase tracking-widest text-out hover:bg-out/5 transition-colors"
          >
            <X className="mr-2 h-4 w-4" /> Reject
          </button>
          <button
            onClick={handleApprove}
            className="inline-flex items-center justify-center bg-ok px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:opacity-90 transition-colors"
          >
            <Check className="mr-2 h-4 w-4" /> Approve
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line p-12 text-center text-slate">
        <p>Return details will appear here.</p>
      </div>
    </div>
  );
}