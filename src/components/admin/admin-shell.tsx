"use client";

/**
 * Luxury Operations & Admin Shell
 *
 * Dedicated control deck for gemologists, vault custodians, and logistics officers:
 *   - L0-L5 staff clearance badge
 *   - High-density sub-navigation: Packing Desk, Inventory, CSV Ingestion, Orders, Staff, Coupons
 *   - Instant vault status indicators
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Clear semantic status indicators.
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  PackageCheck,
  Gem,
  UploadCloud,
  FileSpreadsheet,
  Users,
  Tag,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  Settings,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  href: string;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packing", label: "Packing Desk", badge: "2 Ready", icon: PackageCheck },
  { href: "/admin/inventory", label: "Diamond Inventory", icon: Gem },
  { href: "/admin/vault-ledger", label: "Vault Ledger", icon: Layers },
  { href: "/admin/banners", label: "Editorial Banners", icon: ImageIcon },
  { href: "/admin/returns", label: "Returns Desk", badge: "1 RMA", icon: RotateCcw },
  { href: "/admin/orders", label: "Order Dossiers", icon: FileSpreadsheet },
  { href: "/admin/clients", label: "Clients", icon: UserCheck },
  { href: "/admin/import", label: "CSV Ingestion", icon: UploadCloud },
  { href: "/admin/staff", label: "Staff & Clearance", icon: Users },
  { href: "/admin/coupons", label: "Privilege Codes", icon: Tag },
  { href: "/admin/audit-log", label: "Audit Log", icon: ShieldAlert },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminNavTabs() {
  const pathname = usePathname() ?? "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 py-1.5">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        const Icon = item.icon;

        let buttonClass =
          "text-[var(--color-slate)] hover:text-[var(--color-ink)] hover:bg-white/50 border-transparent";
        if (isActive) {
          buttonClass =
            "bg-white text-[var(--color-ink)] border-[var(--color-line)] font-semibold shadow-xs";
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 border text-xs font-mono uppercase tracking-[0.08em] transition-colors whitespace-nowrap",
              buttonClass
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="font-mono text-[9px] px-1.5 py-0.2 bg-[var(--color-ink)] text-white font-normal ml-0.5">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-stone)] flex flex-col">
      {/* Top Admin Bar */}
      <header className="border-b border-[var(--color-line)] bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/packing" className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-wider text-[var(--color-ink)] font-semibold uppercase">
                Keian Luxandor
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] bg-[var(--color-stone)] border border-[var(--color-line)] px-2 py-0.5 text-[var(--color-ink)]">
                Operations Desk
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--color-slate)] border-l border-[var(--color-line)] pl-4">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Vault Escrow Active</span>
            </div>
          </div>

          {/* Staff Clearance Credential */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-xs font-semibold text-[var(--color-ink)]">
                Elena Vance, GG (GIA)
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--color-slate)]">
                Master Gemologist &bull; Level 4 Clearance
              </p>
            </div>
            <div className="size-8 rounded-none border border-[var(--color-line)] bg-[var(--color-stone)] flex items-center justify-center font-mono text-xs font-bold text-[var(--color-ink)]">
              L4
            </div>
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)] hover:text-[var(--color-ink)] flex items-center gap-1 border-l border-[var(--color-line)] pl-3"
            >
              <span>Storefront</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-[var(--color-line)] bg-[var(--color-stone)] overflow-x-auto scrollbar-none">
          <React.Suspense fallback={<div className="h-10 bg-[var(--color-stone)]" />}>
            <AdminNavTabs />
          </React.Suspense>
        </div>
      </header>

      {/* Main Admin Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
