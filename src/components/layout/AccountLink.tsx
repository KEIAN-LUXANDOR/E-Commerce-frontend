"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useSession } from "@/lib/session";

/** Header link: "Log in" when signed out, the customer's first name when signed in. */
export function AccountLink() {
  const session = useSession();

  if (session.status === "user") {
    const first = session.user.fullName.split(" ")[0];
    return (
      <Link href="/account" className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm hover:bg-stone" aria-label={`Your account, ${session.user.fullName}`}>
        <User className="size-5" aria-hidden />
        <span className="hidden max-w-24 truncate lg:inline">{first}</span>
      </Link>
    );
  }

  return (
    <Link href="/login" className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm hover:bg-stone" aria-label="Log in">
      <User className="size-5" aria-hidden />
      <span className="hidden lg:inline">Log in</span>
    </Link>
  );
}
