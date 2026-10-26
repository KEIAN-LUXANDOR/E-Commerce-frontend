"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ClipboardList,
  ExternalLink,
  Gem,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PackageCheck,
  RotateCcw,
  Settings,
  Tag,
  Users,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Dialog } from "@/components/ui/dialog";
import { logout } from "@/lib/api/auth";
import { setSessionUser, useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/packing", label: "Packing", icon: PackageCheck },
  { href: "/admin/diamonds", label: "Diamonds", icon: Gem },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/returns", label: "Returns", icon: RotateCcw },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn("flex min-h-11 items-center gap-3 px-3 text-sm", active ? "bg-ink text-white" : "text-ink-secondary hover:bg-stone hover:text-ink")}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Admin frame: side menu, who's logged in, log out, link to the shop.
 * Only users with role ADMIN get past it (proxy.ts checks on the server too).
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const session = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function signOut() {
    try {
      await logout();
    } catch {
      // already logged out
    }
    setSessionUser(null);
    router.replace("/admin/login");
  }

  if (session.status === "loading") {
    return <div className="min-h-screen bg-stone" aria-busy="true" />;
  }
  if (session.status === "guest" || session.user.role !== "ADMIN") {
    return (
      <div className="grid min-h-screen place-items-center bg-stone p-6">
        <div className="max-w-sm border border-line bg-white p-8 text-center">
          <p className="font-serif text-2xl">Staff only</p>
          <p className="mt-2 text-sm text-slate">Please log in with an admin account.</p>
          <Link href={`/admin/login?next=${encodeURIComponent(pathname)}`} className="btn btn-primary mt-5">
            Admin log in
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;
  return (
    <div className="min-h-screen bg-stone lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden border-r border-line bg-white lg:flex lg:flex-col">
        <div className="border-b border-line px-5 py-4">
          <Logo href="/admin" size="compact" />
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate">Admin</p>
        </div>
        <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="border-t border-line p-4 text-sm">
          <p className="truncate font-medium">{user.fullName}</p>
          <p className="truncate text-slate">{user.email}</p>
          <div className="mt-3 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-1 text-slate hover:text-ink">
              View shop <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-1 text-slate hover:text-ink">
              <LogOut className="size-3.5" aria-hidden /> Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
          <button type="button" onClick={() => setMenuOpen(true)} className="grid size-11 place-items-center" aria-label="Open admin menu">
            <Menu className="size-5" aria-hidden />
          </button>
          <Logo href="/admin" size="compact" />
          <button type="button" onClick={signOut} className="grid size-11 place-items-center" aria-label="Log out">
            <LogOut className="size-5" aria-hidden />
          </button>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} title="Admin" side="left">
        <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
        <Link href="/" className="mt-6 inline-flex items-center gap-1 text-sm text-slate">
          View shop <ExternalLink className="size-3.5" aria-hidden />
        </Link>
      </Dialog>
    </div>
  );
}
