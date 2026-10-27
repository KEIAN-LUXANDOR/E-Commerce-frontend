"use client";

import { useRouter } from "next/navigation";
import { sessionStore } from "@/lib/session";
import { User, LogOut, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function AccountView() {
  const router = useRouter();
  const session = sessionStore.useSession();
  const user = session?.user;

  if (session.status !== "authenticated" || !user) {
    return null;
  }

  async function handleLogout() {
    await sessionStore.logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between border-b border-line pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-ink">My Account</h1>
          <p className="text-sm text-slate mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-out hover:opacity-80 transition-opacity"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/account/addresses" className="border border-line bg-surface p-6 hover:border-ink transition-colors group">
          <MapPin className="h-6 w-6 text-ink mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink mb-1">Addresses</h2>
          <p className="text-xs text-slate">Manage your shipping and billing addresses.</p>
        </Link>

        <Link href="/account/orders" className="border border-line bg-surface p-6 hover:border-ink transition-colors group">
          <ShoppingBag className="h-6 w-6 text-ink mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink mb-1">Orders</h2>
          <p className="text-xs text-slate">View your order history and tracking status.</p>
        </Link>

        <Link href="/account/profile" className="border border-line bg-surface p-6 hover:border-ink transition-colors group">
          <User className="h-6 w-6 text-ink mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink mb-1">Profile</h2>
          <p className="text-xs text-slate">Update your personal information and password.</p>
        </Link>
      </div>
    </div>
  );
}

export default AccountView;