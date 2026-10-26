"use client";

import { useState } from "react";
import { MailWarning } from "lucide-react";
import { resendVerification } from "@/lib/api/auth";
import { refreshSession } from "@/lib/session";
import type { User } from "@/lib/types/auth";

/** Shown until the email is verified (needed before placing an order). */
export function VerifyEmailNotice({ user, className }: { user: User; className?: string }) {
  const [message, setMessage] = useState<string>();
  const [busy, setBusy] = useState(false);
  if (user.emailVerified) return null;

  async function resend() {
    setBusy(true);
    try {
      const res = await resendVerification(user.email);
      setMessage(res.message);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Couldn’t send the email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div role="status" className={`flex flex-wrap items-start gap-3 border border-warn/30 bg-warn-bg p-4 text-sm text-warn ${className ?? ""}`}>
      <MailWarning className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-medium">Please verify your email address</p>
        <p className="mt-0.5">
          We sent a link to <strong className="font-medium">{user.email}</strong>. You need to verify it before placing an order.
        </p>
        {message && <p className="mt-2">{message}</p>}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={resend} disabled={busy} className="btn btn-secondary min-h-10 text-xs">
          {busy ? "Sending…" : "Send the link again"}
        </button>
        <button type="button" onClick={() => void refreshSession()} className="btn btn-secondary min-h-10 text-xs">
          I’ve verified it
        </button>
      </div>
    </div>
  );
}
