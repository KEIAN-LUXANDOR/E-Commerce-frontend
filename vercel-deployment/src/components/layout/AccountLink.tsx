"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { sessionStore } from "@/lib/session";

export function AccountLink({ mobile = false }: { mobile?: boolean }) {
  const session = sessionStore.useSession();
  const isAuthenticated = session.status === "authenticated";
  const label = isAuthenticated ? "My account" : "Sign in";

  return (
    <Link
      href={isAuthenticated ? "/account" : "/login"}
      className={mobile
        ? "flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-ink"
        : "flex items-center gap-2 text-sm text-ink transition-colors hover:text-loupe"}
      aria-label={label}
    >
      <User className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

export default AccountLink;