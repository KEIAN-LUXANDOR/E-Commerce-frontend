"use client";

import * as React from "react";
import Link from "next/link";
import { formatRupees } from "@/lib/money";
import {
  PackageCheck,
  Gem,
  Truck,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminDashboardPage() {
  const kpiData = [
    {
      title: "Total Vault Valuation",
      value: "₹48,24,90,000",
      subtext: "65 loose certified stones in active custody",
      change: "+4.2% this week",
      icon: Gem,
      color: "text-[var(--color-loupe)]",
    },
    {
      title: "Packing Queue",
      value: "2 Orders",
      subtext: "Pending L3 gemologist loupe inspection",
      change: "Action required today",
      icon: PackageCheck,
      color: "text-[var(--color-low)]",
    },
    {
      title: "Armoured Transits",
      value: "8 Active",
      subtext: "In transit via Sequel Logistics & Malca-Amit",
      change: "100% on schedule",
      icon: Truck,
      color: "text-[var(--color-ok)]",
    },
    {
      title: "24h Settled Revenue",
      value: "₹18,40,000",
      subtext: "Net realized bank settlement",
      change: "+12.8% vs last week",
      icon: TrendingUp,
      color: "text-[var(--color-ink)]",
    },
  ];

  const recentTransits = [
    {
      orderId: "AD-2026-000123",
      customer: "Vikram Mehta (Mumbai)",
      diamond: "1.02 ct Oval F VS1 (IGI LG61234567)",
      carrier: "Sequel Logistics",
      awb: "SEQL-88921-IN",
      status: "Armoured Transit Escort",
      eta: "Today, 4:30 PM",
    },
    {
      orderId: "AD-2026-000124",
      customer: "Sunita Kapoor (New Delhi)",
      diamond: "0.72 ct Round I VS1 (GIA 245109823)",
      carrier: "Malca-Amit Escort",
      awb: "MALCA-44910-DEL",
      status: "Courier Escort Out for Signature",
      eta: "Today, 2:15 PM",
    },
    {
      orderId: "AD-2026-000125",
      customer: "Arjun Reddy (Hyderabad)",
      diamond: "1.05 ct Round D VVS2 (GIA 521890331)",
      carrier: "Sequel Logistics",
      awb: "SEQL-99201-HYD",
      status: "Fulfillment Desk Sealed",
      eta: "Tomorrow, 11:00 AM",
    },
  ];

  const systemHealth = [
    { name: "GIA Report Check API", status: "Operational", ping: "42ms" },
    { name: "IGI Verification Gateway", status: "Operational", ping: "68ms" },
    { name: "Sequel Armoured AWB Dispatch", status: "Operational", ping: "110ms" },
    { name: "Razorpay Luxury Vault Escrow", status: "Operational", ping: "55ms" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-slate)]">
            Executive Operations Deck
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-ink)] mt-1">
            Institutional Fulfillment &amp; Vault Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/packing"
            className="flex items-center gap-2 bg-[var(--color-ink)] text-white px-5 py-2.5 text-xs font-mono uppercase tracking-[0.1em] hover:bg-[var(--color-loupe)] transition-colors"
          >
            <PackageCheck className="size-3.5" />
            Open Packing Desk
          </Link>
          <Link
            href="/admin/inventory"
            className="flex items-center gap-2 border border-[var(--color-line)] bg-white text-[var(--color-ink)] px-5 py-2.5 text-xs font-mono uppercase tracking-[0.1em] hover:bg-[var(--color-stone)] transition-colors"
          >
            <Gem className="size-3.5" />
            Manage Inventory
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="border border-[var(--color-line)] bg-white p-6 shadow-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                    {kpi.title}
                  </span>
                  <Icon className={`size-4 ${kpi.color}`} />
                </div>
                <p className="font-mono text-2xl font-semibold text-[var(--color-ink)]">
                  {kpi.value}
                </p>
                <p className="text-xs text-[var(--color-slate)] mt-1">
                  {kpi.subtext}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-line)] text-[10px] font-mono text-[var(--color-slate)]">
                {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Live Transits + System Health */}
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: Active Armoured Transit Tracking Feed */}
        <div className="border border-[var(--color-line)] bg-white p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
            <div>
              <h2 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                Live Armoured Transits
              </h2>
              <p className="text-xs text-[var(--color-slate)]">
                Direct telemetric checkpoints via Sequel &amp; Malca-Amit
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-mono uppercase tracking-wider text-[var(--color-loupe)] hover:underline flex items-center gap-1"
            >
              View All Orders &rarr;
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[var(--color-line)]">
            {recentTransits.map((transit) => (
              <div key={transit.orderId} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[var(--color-ink)]">
                      {transit.orderId}
                    </span>
                    <span className="border border-[var(--color-line)] bg-[var(--color-stone)] px-2 py-0.2 text-[9px] font-mono uppercase text-[var(--color-slate)]">
                      {transit.carrier}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[var(--color-ink)]">
                    {transit.customer}
                  </p>
                  <p className="text-xs text-[var(--color-slate)]">
                    {transit.diamond}
                  </p>
                  <span className="text-[10px] font-mono text-[var(--color-muted)] block">
                    AWB: {transit.awb}
                  </span>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="inline-block px-2.5 py-0.5 bg-[#e7f0eb] text-[#2f6b4f] text-[10px] font-mono uppercase font-semibold">
                    {transit.status}
                  </span>
                  <p className="text-[11px] text-[var(--color-slate)] font-mono">
                    Est: {transit.eta}
                  </p>
                  <Link
                    href={`/admin/orders/${transit.orderId}`}
                    className="text-[11px] font-mono text-[var(--color-loupe)] hover:underline inline-block pt-1"
                  >
                    Inspect Dossier &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Operational Gateways & Quick Links */}
        <div className="space-y-6">
          {/* Quick Operations Triggers */}
          <div className="border border-[var(--color-line)] bg-white p-6">
            <h2 className="font-serif text-lg font-medium text-[var(--color-ink)] mb-4">
              Operations Navigation
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <Link
                href="/admin/vault-ledger"
                className="border border-[var(--color-line)] p-3 hover:bg-[var(--color-stone)] transition-colors"
              >
                <span className="font-semibold block text-[var(--color-ink)]">Vault Ledger</span>
                <span className="text-[10px] text-[var(--color-muted)]">Stock movements</span>
              </Link>
              <Link
                href="/admin/returns"
                className="border border-[var(--color-line)] p-3 hover:bg-[var(--color-stone)] transition-colors"
              >
                <span className="font-semibold block text-[var(--color-ink)]">Returns Desk</span>
                <span className="text-[10px] text-[var(--color-muted)]">RMA forensics</span>
              </Link>
              <Link
                href="/admin/clients"
                className="border border-[var(--color-line)] p-3 hover:bg-[var(--color-stone)] transition-colors"
              >
                <span className="font-semibold block text-[var(--color-ink)]">Client Registry</span>
                <span className="text-[10px] text-[var(--color-muted)]">VIP KYC portfolios</span>
              </Link>
              <Link
                href="/admin/audit-log"
                className="border border-[var(--color-line)] p-3 hover:bg-[var(--color-stone)] transition-colors"
              >
                <span className="font-semibold block text-[var(--color-ink)]">Audit Log</span>
                <span className="text-[10px] text-[var(--color-muted)]">SHA-256 signatures</span>
              </Link>
            </div>
          </div>

          {/* System Telemetry & Gateways */}
          <div className="border border-[var(--color-line)] bg-white p-6">
            <h2 className="font-serif text-lg font-medium text-[var(--color-ink)] mb-1">
              External Registry Gateways
            </h2>
            <p className="text-xs text-[var(--color-slate)] mb-4">
              Real-time API connectivity and latency checks
            </p>

            <div className="space-y-3 font-mono text-xs">
              {systemHealth.map((sys) => (
                <div key={sys.name} className="flex items-center justify-between py-1.5 border-b border-[var(--color-line)]/50">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#2f6b4f]" />
                    <span className="text-[var(--color-ink)] text-[11px]">{sys.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--color-muted)]">{sys.ping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
