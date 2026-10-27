"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { sessionStore } from "@/lib/session";

const NAV_ITEMS = [
  { label: "Profile", href: "/account" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Orders", href: "/account/orders" },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await sessionStore.logout();
    router.push("/login");
  };

  return (
    <nav className="flex flex-col space-y-2">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
              isActive ? "bg-ink text-white" : "text-ink hover:bg-platinum"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-3 text-xs font-medium uppercase tracking-widest text-out hover:bg-out/5 transition-colors text-left"
      >
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </button>
    </nav>
  );
}

export default AccountNav;