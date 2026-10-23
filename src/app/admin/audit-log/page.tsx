"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { ShieldAlert, Download, Filter, Key } from "lucide-react";
import { showToast } from "@/lib/stores";

interface AuditEntry {
  id: string;
  timestamp: string;
  staff: string;
  clearance: string;
  resource: string;
  action: string;
  category: "METROLOGY" | "INVENTORY" | "FULFILLMENT" | "SECURITY";
  ip: string;
  hash: string;
}

const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "LOG-2026-1049",
    timestamp: "2026-10-22 14:15:02 IST",
    staff: "Pooja Varma",
    clearance: "L3 Gemologist",
    resource: "DIA-LG-1002 (IGI LG61234567)",
    action: "Tamper security bag sealed (Bag #SEAL-9921)",
    category: "FULFILLMENT",
    ip: "192.168.10.42",
    hash: "a81bc7e923190dfca7892b45019efaa6712390ff1209ac7e908123bcdef01234",
  },
  {
    id: "LOG-2026-1048",
    timestamp: "2026-10-22 11:22:18 IST",
    staff: "Ananya Mukherjee",
    clearance: "L5 Chief Gemologist",
    resource: "RMA #RET-2026-0042",
    action: "Approved 4-point forensic return inspection",
    category: "METROLOGY",
    ip: "192.168.10.15",
    hash: "f45612890acbedf0129845019efaa6712390ff1209ac7e908123bcdef0123489",
  },
  {
    id: "LOG-2026-1047",
    timestamp: "2026-10-22 09:12:44 IST",
    staff: "Vikram Sharma",
    clearance: "L4 Operations Lead",
    resource: "Staff #KL-ST-05 (Ramesh Patel)",
    action: "Promoted security clearance from L2 to L3 Gemologist",
    category: "SECURITY",
    ip: "192.168.10.02",
    hash: "bc8901234ef0129845019efaa6712390ff1209ac7e908123bcdef0123489f456",
  },
  {
    id: "LOG-2026-1046",
    timestamp: "2026-10-21 17:40:11 IST",
    staff: "Rajesh Soni",
    clearance: "L3 Gemologist",
    resource: "DIA-NAT-1001",
    action: "Updated price: ₹1,85,000 to ₹1,82,000 following market index",
    category: "INVENTORY",
    ip: "192.168.10.38",
    hash: "789012345bcdef0129845019efaa6712390ff1209ac7e908123bcdef0123489f",
  },
  {
    id: "LOG-2026-1045",
    timestamp: "2026-10-21 14:10:09 IST",
    staff: "Pooja Varma",
    clearance: "L3 Gemologist",
    resource: "CSV Bulk Ingestion Batch #CSV-8812",
    action: "Ingested 14 natural loose stones with GIA verified certificates",
    category: "INVENTORY",
    ip: "192.168.10.42",
    hash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  },
];

export default function AdminAuditLogPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredEntries = useMemo(() => {
    if (categoryFilter === "ALL") return AUDIT_ENTRIES;
    return AUDIT_ENTRIES.filter((e) => e.category === categoryFilter);
  }, [categoryFilter]);

  const handleExportAudit = () => {
    showToast("Generating cryptographic SHA-256 signed audit report...", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
            Cryptographic Audit Registry
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
            Metrology &amp; Operations Audit Log
          </h1>
          <p className="text-xs text-[var(--color-slate)] mt-1">
            Immutable append-only ledger recording all price alterations, certificate updates, and security authorizations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAudit}
          className="inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-mono uppercase tracking-[0.1em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
        >
          <Download className="size-3.5" />
          Export Signed Ledger
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] pb-4">
        {[
          { id: "ALL", label: "All Events" },
          { id: "METROLOGY", label: "Metrology & Forensics" },
          { id: "INVENTORY", label: "Inventory & Pricing" },
          { id: "FULFILLMENT", label: "Packing & Dispatch" },
          { id: "SECURITY", label: "Clearance & Access" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-[0.08em] transition-colors ${
              categoryFilter === tab.id
                ? "bg-[var(--color-ink)] text-white"
                : "border border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:bg-[var(--color-stone)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto shadow-none">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] text-[var(--color-slate)] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Staff Member &amp; Clearance</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Action Summary</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">Terminal IP</th>
              <th className="py-3 px-4 text-right">SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {filteredEntries.map((log) => (
              <tr key={log.id} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[var(--color-ink)]">
                  {log.id}
                </td>
                <td className="py-3 px-4 text-[var(--color-muted)]">
                  {log.timestamp}
                </td>
                <td className="py-3 px-4">
                  <span className="font-sans font-medium text-[var(--color-ink)] block">{log.staff}</span>
                  <span className="text-[10px] text-[var(--color-slate)] block">{log.clearance}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[var(--color-stone)] text-[var(--color-ink)]">
                    {log.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans text-xs text-[var(--color-ink)] max-w-xs">
                  {log.action}
                </td>
                <td className="py-3 px-4 text-[var(--color-loupe)] font-mono text-[11px]">
                  {log.resource}
                </td>
                <td className="py-3 px-4 text-[var(--color-muted)] font-mono text-[11px]">
                  {log.ip}
                </td>
                <td className="py-3 px-4 text-right text-[10px] font-mono text-[var(--color-muted)]">
                  {log.hash.slice(0, 8)}...{log.hash.slice(-6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
