"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import { Layers, ArrowRight, ShieldCheck, Filter, Download } from "lucide-react";
import { showToast } from "@/lib/stores";

interface StockMovement {
  id: string;
  timestamp: string;
  sku: string;
  specs: string;
  type: "INTAKE" | "ALLOCATION" | "DISPATCH" | "RETURN_RESTOCK";
  from: string;
  to: string;
  staff: string;
  hash: string;
}

const MOVEMENTS: StockMovement[] = [
  {
    id: "MOV-2026-0894",
    timestamp: "2026-10-22 14:15 IST",
    sku: "DIA-LG-1002",
    specs: "1.02 ct Oval F VS1 (IGI LG61234567)",
    type: "DISPATCH",
    from: "Packing Desk Station #2",
    to: "Sequel Logistics Armoured Courier",
    staff: "Pooja V. (L3 Gemologist)",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "MOV-2026-0893",
    timestamp: "2026-10-22 11:30 IST",
    sku: "DIA-NAT-1003",
    specs: "1.05 ct Round D VVS2 (GIA 521890331)",
    type: "ALLOCATION",
    from: "Vault Safe Alpha · Drawer 04",
    to: "Packing Desk Station #1",
    staff: "Vikram S. (L4 Vault Custodian)",
    hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
  },
  {
    id: "MOV-2026-0892",
    timestamp: "2026-10-22 09:45 IST",
    sku: "DIA-NAT-1001",
    specs: "0.72 ct Round I VS1 (GIA 245109823)",
    type: "DISPATCH",
    from: "Packing Desk Station #1",
    to: "Malca-Amit Courier Escort",
    staff: "Rajesh S. (L3 Gemologist)",
    hash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
  },
  {
    id: "MOV-2026-0891",
    timestamp: "2026-10-21 16:20 IST",
    sku: "DIA-LG-1009",
    specs: "1.50 ct Emerald E VVS1 (IGI LG6889104)",
    type: "INTAKE",
    from: "Surat Cutting Pipeline Express Inbound",
    to: "Vault Safe Beta · Drawer 01",
    staff: "Ananya M. (L5 Chief Gemologist)",
    hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  },
  {
    id: "MOV-2026-0890",
    timestamp: "2026-10-21 14:05 IST",
    sku: "DIA-NAT-1044",
    specs: "0.98 ct Oval D VS2 (GIA 629014589)",
    type: "RETURN_RESTOCK",
    from: "Forensic Return Inspection Desk",
    to: "Vault Safe Alpha · Drawer 02",
    staff: "Ananya M. (L5 Chief Gemologist)",
    hash: "9f83c602736f12261842f1b0a22d2d1b45ac04b5d0ef37753a8be094ae3ff0e3",
  },
];

export default function VaultLedgerPage() {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredMovements = useMemo(() => {
    if (filterType === "ALL") return MOVEMENTS;
    return MOVEMENTS.filter((m) => m.type === filterType);
  }, [filterType]);

  const handleExportCSV = () => {
    showToast("Exporting cryptographic vault stock ledger to CSV...", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
            Vault Custody &amp; Metrology Chain
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
            Vault Stock Movements &amp; Inventory Ledger
          </h1>
          <p className="text-xs text-[var(--color-slate)] mt-1">
            Immutable chain-of-custody audit log tracking every diamond from inbound pipeline intake to armoured delivery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-mono uppercase tracking-[0.1em] text-[var(--color-ink)] hover:bg-[var(--color-stone)] transition-colors"
        >
          <Download className="size-3.5" />
          Export Audit CSV
        </button>
      </div>

      {/* Movement Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] pb-4">
        {[
          { id: "ALL", label: "All Movements" },
          { id: "INTAKE", label: "Inbound Intake" },
          { id: "ALLOCATION", label: "Vault Allocation" },
          { id: "DISPATCH", label: "Armoured Dispatch" },
          { id: "RETURN_RESTOCK", label: "Return Restocks" },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setFilterType(btn.id)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-[0.08em] transition-colors ${
              filterType === btn.id
                ? "bg-[var(--color-ink)] text-white"
                : "border border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:bg-[var(--color-stone)]"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto shadow-none">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] text-[var(--color-slate)] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Movement ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Diamond SKU &amp; Specs</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Origin / From</th>
              <th className="py-3 px-4">Destination / To</th>
              <th className="py-3 px-4">Authorized Custodian</th>
              <th className="py-3 px-4 text-right">SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {filteredMovements.map((item) => {
              let badgeColor = "bg-[var(--color-stone)] text-[var(--color-ink)]";
              if (item.type === "DISPATCH") {
                badgeColor = "bg-[#e7f0eb] text-[#2f6b4f]";
              } else if (item.type === "INTAKE") {
                badgeColor = "bg-[#cee5ff] text-[#001d33]";
              } else if (item.type === "RETURN_RESTOCK") {
                badgeColor = "bg-[#f6eedf] text-[#8a5a12]";
              }

              return (
                <tr key={item.id} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[var(--color-ink)]">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-muted)]">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-4 font-sans text-xs">
                    <span className="font-mono font-medium text-[var(--color-ink)] block">
                      {item.sku}
                    </span>
                    <span className="text-[11px] text-[var(--color-slate)] block">
                      {item.specs}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${badgeColor}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--color-slate)] font-sans text-xs">
                    {item.from}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-slate)] font-sans text-xs">
                    {item.to}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-ink)] font-sans text-xs">
                    {item.staff}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[10px] text-[var(--color-muted)]">
                    {item.hash.slice(0, 10)}...{item.hash.slice(-6)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
