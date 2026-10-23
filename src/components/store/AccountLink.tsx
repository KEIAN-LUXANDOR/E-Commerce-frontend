"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/session";

function getAccountLabel(session: ReturnType<typeof useSession>): string {
  if (session.status === "user") {
    return session.user.fullName.split(" ")[0];
  }
  if (session.status === "guest") {
    return "Log in";
  }
  return "Account";
}

/** Header link: "Log in" when signed out, the customer's first name when signed in. */
export function AccountLink() {
  const session = useSession();
  const signedIn = session.status === "user";
  const label = getAccountLabel(session);

  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] px-2 text-sm hover:text-loupe"
      aria-label={signedIn ? `Your account, ${session.user.fullName}` : undefined}
    >
      <User className="size-4" aria-hidden />
      <span className="max-w-28 truncate">{label}</span>
    </Link>
  );
}
