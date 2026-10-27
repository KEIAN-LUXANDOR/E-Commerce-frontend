"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  ShoppingCart,
  Users,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare
} from "lucide-react";
import { sessionStore } from "@/lib/session";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/diamonds", icon: Gem },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = sessionStore.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = session?.user?.role?.toUpperCase();
  const isAuthorized = role === "ADMIN" || role === "OWNER";

  useEffect(() => {
    if (session.status === "unauthenticated" || (session.status === "authenticated" && !isAuthorized)) {
      router.push("/admin/login");
    }
  }, [session.status, isAuthorized, router]);

  async function handleLogout() {
    await sessionStore.logout();
    router.push("/admin/login");
  }

  if (session.status === "loading" || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-platinum">
        <p className="text-sm font-medium text-slate animate-pulse">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-platinum">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/50 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-line bg-surface transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-6">
            <span className="text-lg font-medium text-ink">Luxandor Admin</span>
            <button className="md:hidden text-slate hover:text-ink" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {NAV.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-[3px] px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ink text-white"
                      : "text-slate hover:bg-platinum hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-line p-4">
            <div className="mb-4 px-3">
              <p className="text-sm font-medium text-ink truncate">Admin User</p>
              <p className="text-xs text-slate truncate">{session.user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-[3px] px-3 py-2 text-sm font-medium text-out hover:bg-out/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center border-b border-line bg-surface px-4 sm:px-6 md:hidden">
          <button
            type="button"
            className="text-slate hover:text-ink focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminShell;