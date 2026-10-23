"use client";

/**
 * Operations Desk: Master Order Dossiers
 * Route: /admin/orders
 *
 * Full audit view of all client acquisitions, payment escrow, and logistics status:
 *   - Search orders by customer, reference, or courier AWB
 *   - Financial totals and GST records
 *   - Direct link to full Order Dossier inspection
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 */

import * as React from "react";
import Link from "next/link";
import { Search, FileSpreadsheet, ExternalLink, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/format";
import { Input } from "@/components/ui/input";

export interface AdminOrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  diamondTitle: string;
  certNumber: string;
  totalPaise: number;
  status: "PAYMENT_LOCKED" | "INSPECTED" | "SEALED" | "ARMED_TRANSIT" | "DELIVERED";
  courier: string;
  awb: string;
}

const ADMIN_ORDERS: AdminOrderRecord[] = [
  {
    id: "KL-2026-98214",
    customerName: "Aarav Mehta",
    customerEmail: "aarav.mehta@example.com",
    date: "2026-10-21",
    diamondTitle: "2.00 ct Round Brilliant Solitaire",
    certNumber: "2287654321",
    totalPaise: 92700000,
    status: "ARMED_TRANSIT",
    courier: "Sequel Secure Armoured Escort",
    awb: "SEQ-IN-9812401",
  },
  {
    id: "KL-2026-89102",
    customerName: "Radhika Parekh",
    customerEmail: "radhika.p@example.com",
    date: "2026-09-14",
    diamondTitle: "1.52 ct Oval Cut Solitaire",
    certNumber: "5123987114",
    totalPaise: 49440000,
    status: "DELIVERED",
    courier: "Malca-Amit Luxury Logistics",
    awb: "MALCA-884192",
  },
  {
    id: "KL-2026-99014",
    customerName: "Pooja Singhania",
    customerEmail: "pooja.s@singhania.in",
    date: "2026-10-22",
    diamondTitle: "2.51 ct Oval Solitaire (Natural)",
    certNumber: "6298144210",
    totalPaise: 169950000,
    status: "PAYMENT_LOCKED",
    courier: "Sequel Secure Armoured Transit",
    awb: "PENDING_SEAL",
  },
];

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filtered = ADMIN_ORDERS.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.certNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-ink)]">
            Acquisition Order Dossiers
          </h1>
          <p className="font-mono text-xs text-[var(--color-slate)] mt-1">
            Complete transaction provenance, payment escrow status, and transit audit trail
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-line)] p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted)]" />
          <Input
            type="text"
            placeholder="Search by order ID, customer name, or certificate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-mono text-xs"
          />
        </div>
      </div>

      <div className="border border-[var(--color-line)] bg-white overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-ink)]">
            <tr>
              <th className="py-3.5 px-4">Order ID & Date</th>
              <th className="py-3.5 px-4">Client Dossier</th>
              <th className="py-3.5 px-4">Diamond Solitaire</th>
              <th className="py-3.5 px-4">Cert #</th>
              <th className="py-3.5 px-4">Total (inc. GST)</th>
              <th className="py-3.5 px-4">Transit Status</th>
              <th className="py-3.5 px-4 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {filtered.map((order) => {
              let statusBadge = "bg-stone-100 text-stone-800 border-stone-200";
              if (order.status === "DELIVERED") {
                statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
              } else if (order.status === "ARMED_TRANSIT") {
                statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
              } else if (order.status === "PAYMENT_LOCKED") {
                statusBadge = "bg-blue-50 text-blue-800 border-blue-200";
              }

              return (
                <tr key={order.id} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-semibold text-xs text-[var(--color-ink)] block">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-[var(--color-slate)]">{order.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-sans font-medium text-[var(--color-ink)]">
                      {order.customerName}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--color-slate)]">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-serif text-sm text-[var(--color-ink)]">
                    {order.diamondTitle}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--color-slate)]">
                    #{order.certNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[var(--color-ink)]">
                    {formatINR(order.totalPaise)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${statusBadge}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-slate)] underline"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="size-3" />
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
