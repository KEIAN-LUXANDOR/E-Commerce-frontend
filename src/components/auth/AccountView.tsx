"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AddressBook } from "@/components/auth/AddressBook";
import { FormAlert } from "@/components/auth/FormParts";
import { logout, resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { setSessionUser, useSession } from "@/lib/session";

const joined = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));

/** Signed-in customer's details from GET /auth/me, with log out. */
export function AccountView() {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string>();
  // Set while logging out, so we go home instead of being sent to the login page
  const leaving = useRef(false);

  // Session ended on the server (expired or logged out elsewhere): go to login
  useEffect(() => {
    if (session.status === "guest" && !leaving.current) router.replace("/login?next=/account");
  }, [session.status, router]);

  async function onLogout() {
    setBusy(true);
    setError(undefined);
    try {
      await logout();
      leaving.current = true;
      setSessionUser(null);
      router.replace("/");
      router.refresh();
    } catch (err) {
      // 401 means the session had already ended, which is what the shopper wanted anyway
      if (err instanceof ApiError && err.status === 401) {
        leaving.current = true;
        setSessionUser(null);
        router.replace("/");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Couldn’t log you out. Please try again.");
      setBusy(false);
    }
  }

  async function onResendVerification() {
    if (session.status !== "user") return;
    setVerificationBusy(true);
    setError(undefined);
    setVerificationMessage(undefined);
    try {
      const response = await resendVerification(session.user.email);
      setVerificationMessage(response.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn’t send the verification email. Please try again.");
    } finally {
      setVerificationBusy(false);
    }
  }

  if (session.status !== "user") {
    return (
      <div aria-busy="true" className="space-y-3">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="skeleton h-24 rounded" />
      </div>
    );
  }

  const u = session.user;
  const rows: [string, string][] = [
    ["Name", u.fullName],
    ["Email", u.email],
    ["Mobile", u.phone ?? "Not added"],
    ["Member since", joined(u.createdAt)],
  ];

  return (
    <div className="space-y-8">
      {error && <FormAlert>{error}</FormAlert>}
      <section aria-labelledby="details" className="rounded-[3px] border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="details" className="text-2xl">
            Your details
          </h2>
          {u.role === "ADMIN" && <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">Admin</span>}
        </div>
        <dl className="mt-4 divide-y divide-line text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-slate">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        {!u.emailVerified && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-slate">Your email isn’t verified yet. You can log in and shop, but must verify before placing an order.</p>
              {verificationMessage && <FormAlert tone="info">{verificationMessage}</FormAlert>}
              <button type="button" onClick={onResendVerification} disabled={verificationBusy} className="btn btn-secondary">
                {verificationBusy ? "Sending…" : "Resend verification email"}
              </button>
            </div>
          )}
      </section>

      <AddressBook />

      <section aria-labelledby="coming" className="text-sm text-slate">
        <h2 id="coming" className="sr-only">Coming soon</h2>
        <p>Orders and your wishlist will appear here as they’re added.</p>
      </section>

      <button type="button" onClick={onLogout} disabled={busy} className="btn btn-secondary">
        {busy ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}
