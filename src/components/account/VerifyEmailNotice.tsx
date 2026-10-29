"use client";

import { useState } from "react";
import { resendVerification } from "@/lib/api/auth";
import { showToast } from "@/lib/stores";

export function VerifyEmailNotice({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    try {
      await resendVerification(email);
      showToast("Verification email sent.", { tone: "success" });
    } catch (err: unknown) {
      showToast(err instanceof Error && err.message ? err.message : "Failed to resend verification.", { tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-surface border border-line flex items-center justify-between">
      <p className="text-sm text-ink">Please verify your email address.</p>
      <button
        onClick={handleResend}
        disabled={loading}
        className="text-xs font-medium uppercase tracking-widest text-loupe hover:underline"
      >
        Resend Email
      </button>
    </div>
  );
}

export default VerifyEmailNotice;