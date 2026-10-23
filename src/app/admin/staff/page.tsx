"use client";

/**
 * Staff Directory & Security Clearance Matrix
 * Route: /admin/staff
 *
 * Role-Based Access Control (RBAC) levels:
 *   - L0: Guest / Read-Only Storefront
 *   - L1: Digital Concierge
 *   - L2: Armoured Logistics Dispatcher
 *   - L3: Vault Custodian & Packaging
 *   - L4: Master Gemologist (Loupe & Inscription Verification)
 *   - L5: Managing Director & Escrow Authority
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 */

import * as React from "react";
import { Users, Shield, Key, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/stores";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  clearance: "L1" | "L2" | "L3" | "L4" | "L5";
  department: string;
  email: string;
  lastActive: string;
}

const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "stf-01",
    name: "Dr. Elena Vance, GG",
    role: "Master Gemologist",
    clearance: "L4",
    department: "Gemological Metrology",
    email: "elena.vance@keianluxandor.com",
    lastActive: "Just now",
  },
  {
    id: "stf-02",
    name: "Kabir Desai",
    role: "Chief Vault Custodian",
    clearance: "L3",
    department: "High-Security Vault & Packaging",
    email: "kabir.desai@keianluxandor.com",
    lastActive: "12m ago",
  },
  {
    id: "stf-03",
    name: "Meera Subramanian",
    role: "Logistics Escort Lead",
    clearance: "L2",
    department: "Armoured Transport Coordination",
    email: "meera.s@keianluxandor.com",
    lastActive: "1h ago",
  },
  {
    id: "stf-04",
    name: "Aditya Singhania",
    role: "Managing Director",
    clearance: "L5",
    department: "Executive & Financial Escrow",
    email: "aditya.s@keianluxandor.com",
    lastActive: "3h ago",
  },
];

export default function AdminStaffPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-ink)]">
            Staff Directory &amp; Security Clearance
          </h1>
          <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
            Access levels L0 to L5 governing vault access, inscription audits, and escrow releases
          </p>
        </div>
        <Button
          onClick={() =>
            showToast("Security credential invitation modal provisioned.", "info")
          }
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
        >
          <Plus className="size-4" />
          <span>Provision Clearance</span>
        </Button>
      </div>

      {/* Clearance Level Explanation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
        <div className="border border-[var(--color-line)] p-3 bg-white">
          <span className="font-bold text-[var(--color-ink)] block">Level 1</span>
          <span className="text-[10px] text-[var(--color-slate)]">Concierge &amp; Inquiries</span>
        </div>
        <div className="border border-[var(--color-line)] p-3 bg-white">
          <span className="font-bold text-[var(--color-ink)] block">Level 2</span>
          <span className="text-[10px] text-[var(--color-slate)]">Armoured Waybill Dispatch</span>
        </div>
        <div className="border border-[var(--color-line)] p-3 bg-white">
          <span className="font-bold text-[var(--color-ink)] block">Level 3</span>
          <span className="text-[10px] text-[var(--color-slate)]">Physical Vault Custody</span>
        </div>
        <div className="border border-[var(--color-line)] p-3 bg-white">
          <span className="font-bold text-[var(--color-ink)] block">Level 4</span>
          <span className="text-[10px] text-[var(--color-slate)]">Forensic Loupe Audit</span>
        </div>
        <div className="border border-[var(--color-line)] p-3 bg-[var(--color-stone)]">
          <span className="font-bold text-[var(--color-ink)] block">Level 5</span>
          <span className="text-[10px] text-[var(--color-slate)]">Executive Escrow Release</span>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-ink)]">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Department &amp; Title</th>
              <th className="py-3 px-4">Clearance</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Biometric Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {STAFF_MEMBERS.map((stf) => (
              <tr key={stf.id} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-sans font-medium text-sm text-[var(--color-ink)]">
                    {stf.name}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--color-slate)]">ID: {stf.id}</p>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">
                  <span className="text-[var(--color-ink)] block font-medium">{stf.role}</span>
                  <span className="text-[10px] text-[var(--color-slate)]">{stf.department}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2 py-0.5 border border-[var(--color-ink)] bg-[var(--color-ink)] text-white font-mono text-xs font-bold">
                    {stf.clearance}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[var(--color-slate)]">
                  {stf.email}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-emerald-800 flex items-center gap-1.5 pt-4">
                  <CheckCircle className="size-3.5" />
                  <span>Hardware Key Active</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Auditing clearance permissions for ${stf.name}...`, "info")
                    }
                    className="text-[var(--color-ink)] underline hover:text-[var(--color-slate)] uppercase tracking-wider text-[11px]"
                  >
                    Audit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
