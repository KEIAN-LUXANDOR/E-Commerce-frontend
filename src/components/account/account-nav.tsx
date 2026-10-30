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
/**
 * Customer Account Navigation Bar
 *
 * Minimal editorial navigation:
 *   - Profile & Security
 *   - Delivery Addresses
 *   - Orders & Logistics
 *   - Digital Vault
 *
 * Responsive:
 *   - Horizontal navigation on mobile
 *   - Vertical navigation on desktop
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { href: "/account", label: "Profile", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/vault", label: "Certificates", icon: FileText },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/account") return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountNav({
  className,
}: {
  className?: string;
}) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className={cn("w-full min-w-0", className)}
      aria-label="Account navigation"
    >
      <ul
        className={cn(
          "flex min-w-0 items-center gap-1.5",
          "overflow-x-auto border-b border-line pb-2",
          "lg:flex-col lg:items-stretch lg:gap-1.5",
          "lg:overflow-visible lg:border-0 lg:pb-0",
        )}
      >
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="shrink-0 lg:w-full">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex h-11 items-center",
                  "gap-2.5 rounded-lg border px-3",
                  "text-[13px] font-medium whitespace-nowrap",
                  "transition-colors duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-brand-accent",
                  "focus-visible:ring-offset-2",
                  "lg:h-11 lg:w-full lg:px-3.5",

                  active
                    ? "border-brand-anchor bg-brand-anchor text-white"
                    : "border-line bg-stone text-ink-secondary hover:border-brand-accent-muted hover:bg-brand-accent-muted hover:text-brand-anchor",
                )}
              >
                <Icon
                  className={cn(
                    "size-[17px] shrink-0 transition-colors",
                    active
                      ? "text-white"
                      : "text-slate group-hover:text-brand-anchor",
                  )}
                />

                <span className="min-w-0 flex-1 leading-none">
                  {item.label}
                </span>

                {active && (
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-white"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default AccountNav;