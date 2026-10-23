"use client";

import * as React from "react";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import { RotateCcw, ShieldCheck, Eye, AlertCircle, ArrowRight } from "lucide-react";

interface ReturnCase {
  rmaId: string;
  orderId: string;
  client: string;
  location: string;
  diamond: string;
  certNumber: string;
  valuePaise: number;
  reason: string;
  status: "INSPECTION_PENDING" | "IN_TRANSIT" | "REFUND_RELEASED" | "REJECTED";
  receivedDate: string;
}

const RETURN_CASES: ReturnCase[] = [
  {
    rmaId: "RET-2026-0042",
    orderId: "AD-2026-000118",
    client: "Aditya Singhania",
    location: "Bengaluru, Karnataka",
    diamond: "1.02 ct Oval Brilliant Lab-Grown (IGI LG61234567)",
    certNumber: "LG61234567",
    valuePaise: 47320000,
    reason: "Upgrading to a 1.50 ct Emerald cut stone from catalog",
    status: "INSPECTION_PENDING",
    receivedDate: "2026-10-22 10:15 IST",
  },
  {
    rmaId: "RET-2026-0041",
    orderId: "AD-2026-000095",
    client: "Rohit Verma",
    location: "New Delhi",
    diamond: "0.72 ct Round Natural (GIA 245109823)",
    certNumber: "245109823",
    valuePaise: 18500000,
    reason: "Aesthetic preference; decided on larger carat",
    status: "REFUND_RELEASED",
    receivedDate: "2026-10-18 14:00 IST",
  },
];

export default function AdminReturnsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
            Forensic Return Desk
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
            Customer Returns &amp; Evaluation Ledger
          </h1>
          <p className="text-xs text-[var(--color-slate)] mt-1">
            Review RMA requests, verify laser inscriptions and physical certificates, and authorize refund releases.
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border border-[var(--color-line)] bg-white p-5">
          <span className="text-[11px] font-mono uppercase text-[var(--color-muted)]">Active RMA Requests</span>
          <p className="font-mono text-2xl font-bold text-[var(--color-ink)] mt-1">1 Open</p>
          <span className="text-[11px] text-[var(--color-low)] mt-1 block">Requires Loupe Inspection</span>
        </div>
        <div className="border border-[var(--color-line)] bg-white p-5">
          <span className="text-[11px] font-mono uppercase text-[var(--color-muted)]">Refunds Settled (30d)</span>
          <p className="font-mono text-2xl font-bold text-[var(--color-ink)] mt-1">₹18,50,000</p>
          <span className="text-[11px] text-[var(--color-ok)] mt-1 block">100% On-Time Forensics</span>
        </div>
        <div className="border border-[var(--color-line)] bg-white p-5">
          <span className="text-[11px] font-mono uppercase text-[var(--color-muted)]">Fraud / Alteration Rate</span>
          <p className="font-mono text-2xl font-bold text-[#2f6b4f] mt-1">0.00%</p>
          <span className="text-[11px] text-[var(--color-muted)] mt-1 block">Laser Tamper Pouch Protected</span>
        </div>
      </div>

      {/* Returns Table */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto shadow-none">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] text-[var(--color-slate)] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">RMA Number</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Client &amp; City</th>
              <th className="py-3 px-4">Diamond Specimen</th>
              <th className="py-3 px-4">Return Reason</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {RETURN_CASES.map((item) => {
              let badgeColor = "bg-[var(--color-stone)] text-[var(--color-ink)]";
              if (item.status === "INSPECTION_PENDING") {
                badgeColor = "bg-[#f6eedf] text-[#8a5a12]";
              } else if (item.status === "REFUND_RELEASED") {
                badgeColor = "bg-[#e7f0eb] text-[#2f6b4f]";
              }

              return (
                <tr key={item.rmaId} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-[var(--color-ink)]">
                    {item.rmaId}
                  </td>
                  <td className="py-4 px-4 text-[var(--color-muted)]">
                    {item.orderId}
                  </td>
                  <td className="py-4 px-4 font-sans text-xs">
                    <span className="font-medium text-[var(--color-ink)] block">{item.client}</span>
                    <span className="text-[11px] text-[var(--color-slate)] block">{item.location}</span>
                  </td>
                  <td className="py-4 px-4 font-sans text-xs max-w-xs">
                    <span className="font-medium text-[var(--color-ink)] block">{item.diamond}</span>
                    <span className="text-[10px] font-mono text-[var(--color-muted)] block">
                      Recv: {item.receivedDate}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-sans text-xs text-[var(--color-slate)] max-w-xs">
                    {item.reason}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[var(--color-ink)]">
                    {formatRupees(item.valuePaise)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${badgeColor}`}>
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/admin/returns/${item.rmaId}`}
                      className="inline-flex items-center gap-1 bg-[var(--color-ink)] text-white px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider hover:bg-[var(--color-loupe)] transition-colors"
                    >
                      <Eye className="size-3" />
                      Inspect &rarr;
                    </Link>
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
