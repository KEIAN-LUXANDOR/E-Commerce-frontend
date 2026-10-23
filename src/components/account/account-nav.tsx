"use client";

/**
 * Customer Account Navigation Bar
 *
 * Provides a clean editorial tab/sidebar navigation for customer portal:
 *   - Profile & Security
 *   - Delivery Addresses
 *   - Orders & Logistics
 *   - Digital Vault (Certificates & Insurance Dossiers)
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Responsive horizontal pills on mobile, left-side list on desktop.
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, MapPin, Package, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { href: "/account", label: "Profile", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/vault", label: "Certificates", icon: FileText },
];

export function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("w-full", className)}
      aria-label="Account navigation"
    >
      <div className="flex gap-1 overflow-x-auto border-b border-line pb-3 lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          let linkStyle =
            "border-transparent text-slate hover:bg-stone hover:text-ink";
          if (isActive) {
            linkStyle =
              "border-ink bg-stone text-ink font-medium";
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-10 items-center gap-2.5 border-l-2 px-3 py-2 text-sm transition-colors whitespace-nowrap lg:w-full",
                linkStyle
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
