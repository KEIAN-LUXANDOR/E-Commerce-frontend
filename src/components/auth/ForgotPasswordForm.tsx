"use client";

import { useState } from "react";
import { FormAlert, TextField } from "@/components/auth/FormParts";
import { requestPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { normaliseEmail } from "@/lib/validators";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!normaliseEmail(email)) {
      setError("Enter your email address.");
      return;
    }

    setError(undefined);
    setSuccessMessage(undefined);
    setBusy(true);
    try {
      const response = await requestPasswordReset(normaliseEmail(email));
      setSent(true);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {successMessage && <FormAlert tone="info">{successMessage}</FormAlert>}
      {error && <FormAlert>{error}</FormAlert>}
      <TextField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={sent}
      />
      {!sent && (
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      )}
    </form>
  );
}
