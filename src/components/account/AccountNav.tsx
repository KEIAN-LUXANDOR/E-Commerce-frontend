"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, MapPin, Package, UserRound } from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/api/auth";
import { setSessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/account", label: "Profile", icon: UserRound, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: true },
  { href: "/wishlist", label: "Saved diamonds", icon: Heart, exact: true },
];

/** Account menu: a row of tabs on phones, a list on the left on computers. */
export function AccountNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await logout();
    } catch {
      // Already logged out on the server: carry on
    }
    setSessionUser(null);
    router.replace("/");
    router.refresh();
  }

  return (
    <nav aria-label="Your account" className="flex gap-1 overflow-x-auto border-b border-line pb-3 lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
      {ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn("flex min-h-11 shrink-0 items-center gap-2.5 border-l-2 px-3 text-sm whitespace-nowrap lg:w-full", active ? "border-ink bg-stone font-medium text-ink" : "border-transparent text-slate hover:bg-stone hover:text-ink")}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
      <button type="button" onClick={signOut} disabled={busy} className="flex min-h-11 shrink-0 items-center gap-2.5 border-l-2 border-transparent px-3 text-left text-sm text-slate hover:bg-stone hover:text-ink lg:mt-4 lg:w-full">
        <LogOut className="size-4 shrink-0" aria-hidden />
        {busy ? "Logging out…" : "Log out"}
      </button>
    </nav>
  );
}
