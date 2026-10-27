"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { sessionStore } from "@/lib/session";

export function AccountLink() {
  const session = sessionStore.useSession();
  const isAuthenticated = session?.status === "authenticated";
  
  // Safely extract the user's first name if logged in
  const name = session?.user?.fullName?.split(" ")[0] || "Account";

  return (
    <Link
      href={isAuthenticated ? "/account" : "/login"}
      aria-label={isAuthenticated ? "My Account" : "Log in"}
      className="relative inline-flex h-10 w-10 xl:w-auto xl:px-3 items-center justify-center gap-2 text-ink hover:bg-platinum transition-colors rounded-[3px]"
    >
      <User className="h-5 w-5" />
      <span className="hidden xl:inline-block text-xs font-medium">
        {isAuthenticated ? name : "Log in"}
      </span>
    </Link>
  );
}

export default AccountLink;