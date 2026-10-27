"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { sessionStore } from "@/lib/session";

export function AccountLink() {
  const session = sessionStore.useSession();
  const isAuthenticated = session.status === "authenticated";

  return (
    <Link
      href={isAuthenticated ? "/account" : "/login"}
      className="p-2 text-slate hover:text-ink transition-colors"
      aria-label="Account"
    >
      <User className="h-5 w-5" />
    </Link>
  );
}

export default AccountLink;