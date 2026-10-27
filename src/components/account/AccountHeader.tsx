"use client";

import { sessionStore } from "@/lib/session";

export function AccountHeader() {
  const session = sessionStore.useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="mb-8 border-b border-line pb-4">
      <h1 className="text-2xl font-serif tracking-widest text-ink">
        Welcome back, {(user as any).name || (user as any).firstName || "Guest"}
      </h1>
      <p className="text-sm text-slate mt-1">{user.email}</p>
    </div>
  );
}

export default AccountHeader;