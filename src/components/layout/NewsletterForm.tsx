"use client";

import { useState } from "react";
import { showToast } from "@/lib/stores";
import { isEnabled } from "@/config/features";
import { subscribeNewsletter } from "@/lib/api/support";

/**
 * Newsletter sign-up with explicit consent (required under India's DPDP Act).
 * TODO (backend): POST /api/newsletter { email, consent: true }. For now it only confirms on screen.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const enabled = isEnabled("newsletter");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled) {
      setError("Newsletter sign-up is not available yet.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    if (!consent) {
      setError("Tick the box to agree to receive emails.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await subscribeNewsletter(email.trim());
      setEmail("");
      setConsent(false);
      showToast("Subscribed. You'll get one email when new diamonds arrive.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      noValidate
      className="mt-4 space-y-3"
      onSubmit={submit}
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!enabled || busy}
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="field text-sm"
        />
        <button type="submit" disabled={!enabled || busy} className="btn btn-primary shrink-0 disabled:opacity-50">
          {busy ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-sm text-slate">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={!enabled || busy} className="mt-1 size-4 accent-ink" />
        <span>I agree to receive emails about new diamonds. I can unsubscribe at any time.</span>
      </label>
      {error && (
        <p id="newsletter-error" className="text-sm text-out">
          {error}
        </p>
      )}
      {!enabled && <p className="text-sm text-slate">Newsletter sign-up is not available yet.</p>}
    </form>
  );
}
