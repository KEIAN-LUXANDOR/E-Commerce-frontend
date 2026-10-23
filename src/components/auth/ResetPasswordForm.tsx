"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormAlert, PasswordField } from "@/components/auth/FormParts";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError("Use a password between 8 and 72 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setError(undefined);
    setBusy(true);
    try {
      const response = await resetPassword({ token, newPassword: password });
      setSuccess(response.message);
      setComplete(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (complete) {
    return (
      <div className="space-y-5">
        <FormAlert tone="info">{success}</FormAlert>
        <a href="/login" className="btn btn-primary block w-full text-center">Go to log in</a>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {error && <FormAlert>{error}</FormAlert>}
      <PasswordField
        label="New password"
        name="new-password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <PasswordField
        label="Confirm new password"
        name="confirm-password"
        autoComplete="new-password"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
