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
import { User, MapPin, Package, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { href: "/account", label: "Profile & Identity", icon: User },
  { href: "/account/orders", label: "Acquisitions & Orders", icon: Package },
  { href: "/account/addresses", label: "Insured Addresses", icon: MapPin },
  { href: "/account/vault", label: "Gemological Vault", icon: Award },
];

export function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("w-full border-b border-[var(--color-line)] lg:border-b-0", className)}
      aria-label="Account navigation"
    >
      <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          let linkStyle =
            "border-transparent text-[var(--color-slate)] hover:text-[var(--color-ink)] hover:bg-[var(--color-stone)]";
          if (isActive) {
            linkStyle =
              "border-[var(--color-ink)] bg-[var(--color-stone)] text-[var(--color-ink)] font-medium";
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2.5 border text-xs font-mono uppercase tracking-[0.08em] transition-colors whitespace-nowrap",
                linkStyle
              )}
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
