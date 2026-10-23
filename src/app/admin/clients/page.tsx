"use client";

import * as React from "react";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import { UserCheck, ShieldCheck, Search, Eye, ArrowRight } from "lucide-react";

interface ClientRecord {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  kycStatus: "VERIFIED" | "PENDING_PAN" | "UNDER_REVIEW";
  totalSpendPaise: number;
  orderCount: number;
  lastActive: string;
}

const CLIENT_RECORDS: ClientRecord[] = [
  {
    id: "KL-CL-1042",
    name: "Ananya Singhal",
    city: "Mumbai, Maharashtra",
    email: "ananya.singhal@luxholdings.in",
    phone: "+91 98201 44890",
    kycStatus: "VERIFIED",
    totalSpendPaise: 84500000,
    orderCount: 3,
    lastActive: "Today, 11:30 IST",
  },
  {
    id: "KL-CL-1043",
    name: "Vikram Mehta",
    city: "Mumbai, Maharashtra",
    email: "v.mehta@realtyinfra.com",
    phone: "+91 98985 52297",
    kycStatus: "VERIFIED",
    totalSpendPaise: 47320000,
    orderCount: 1,
    lastActive: "Today, 14:15 IST",
  },
  {
    id: "KL-CL-1044",
    name: "Sunita Kapoor",
    city: "New Delhi",
    email: "sunita.kapoor@heritage.org",
    phone: "+91 98110 33412",
    kycStatus: "VERIFIED",
    totalSpendPaise: 18500000,
    orderCount: 1,
    lastActive: "Yesterday",
  },
  {
    id: "KL-CL-1045",
    name: "Devendra Patel",
    city: "Ahmedabad, Gujarat",
    email: "dpatel@pateltextiles.in",
    phone: "+91 98790 88210",
    kycStatus: "PENDING_PAN",
    totalSpendPaise: 0,
    orderCount: 0,
    lastActive: "3 days ago",
  },
];

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
            Private Client Office
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
            Client Directory &amp; Portfolios
          </h1>
          <p className="text-xs text-[var(--color-slate)] mt-1">
            Master directory of high-net-worth diamond collectors, KYC compliance statuses, and cumulative vault purchases.
          </p>
        </div>
      </div>

      {/* Client Table */}
      <div className="border border-[var(--color-line)] bg-white overflow-x-auto shadow-none">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--color-stone)] border-b border-[var(--color-line)] text-[var(--color-slate)] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Client ID</th>
              <th className="py-3 px-4">Client Name &amp; Domicile</th>
              <th className="py-3 px-4">Contact Coordinates</th>
              <th className="py-3 px-4">KYC Compliance</th>
              <th className="py-3 px-4">Cumulative Spend</th>
              <th className="py-3 px-4">Orders</th>
              <th className="py-3 px-4">Last Activity</th>
              <th className="py-3 px-4 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {CLIENT_RECORDS.map((client) => {
              const isVerified = client.kycStatus === "VERIFIED";

              return (
                <tr key={client.id} className="hover:bg-[var(--color-stone)]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--color-ink)]">
                    {client.id}
                  </td>
                  <td className="py-3 px-4 font-sans text-xs">
                    <span className="font-medium text-[var(--color-ink)] block">{client.name}</span>
                    <span className="text-[11px] text-[var(--color-slate)] block">{client.city}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[var(--color-ink)] block">{client.phone}</span>
                    <span className="text-[11px] text-[var(--color-muted)] block">{client.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                        isVerified ? "bg-[#e7f0eb] text-[#2f6b4f]" : "bg-[#f6eedf] text-[#8a5a12]"
                      }`}
                    >
                      {client.kycStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[var(--color-ink)]">
                    {formatRupees(client.totalSpendPaise)}
                  </td>
                  <td className="py-3 px-4">
                    {client.orderCount} {client.orderCount === 1 ? "order" : "orders"}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-muted)] text-[11px]">
                    {client.lastActive}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="inline-flex items-center gap-1 bg-[var(--color-ink)] text-white px-3 py-1.5 text-[11px] uppercase tracking-wider hover:bg-[var(--color-loupe)] transition-colors"
                    >
                      <Eye className="size-3" />
                      Dossier &rarr;
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
