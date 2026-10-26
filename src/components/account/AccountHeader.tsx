"use client";

import { VerifyEmailNotice } from "@/components/account/VerifyEmailNotice";
import { useSession } from "@/lib/session";

/** "Hello, Riya" plus the verify-email reminder when needed. */
export function AccountHeader() {
  const session = useSession();
  let greeting = "Your account";
  if (session.status === "user") greeting = `Hello, ${session.user.fullName.split(" ")[0]}`;
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{greeting}</h1>
      <p className="mt-2 text-slate">Your details, orders, addresses and saved diamonds.</p>
      {session.status === "user" && <VerifyEmailNotice user={session.user} className="mt-5" />}
    </div>
  );
}
