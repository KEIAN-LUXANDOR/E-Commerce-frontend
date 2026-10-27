"use client";

import { useState } from "react";
import { Activity, Search, Filter } from "lucide-react";
import { showToast } from "@/lib/stores";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");

  const handleExport = () => {
    // Corrected to object format
    showToast("Exporting audit log...", { tone: "default" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-medium text-ink flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Audit Log
        </h1>
        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center bg-ink px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-loupe-deep transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-surface border border-line p-12 text-center text-slate">
        <Activity className="mx-auto h-12 w-12 opacity-50 mb-4" />
        <p>Audit logging is configured. Events will appear here.</p>
      </div>
    </div>
  );
}