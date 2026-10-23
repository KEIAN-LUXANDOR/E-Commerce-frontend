"use client";

import { useState } from "react";
import { showToast } from "@/lib/stores";

/**
 * Newsletter sign-up with explicit consent (required under India's DPDP Act).
 * TODO (backend): POST /api/newsletter { email, consent: true }. For now it only confirms on screen.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <form
      noValidate
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter an email address like name@example.com.");
        if (!consent) return setError("Tick the box to agree to receive emails.");
        setError(undefined);
        setEmail("");
        setConsent(false);
        showToast("Subscribed. You'll get one email when new diamonds arrive.");
      }}
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
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="field text-sm"
        />
        <button type="submit" className="btn btn-primary shrink-0">
          Subscribe
        </button>
      </div>
      <label className="flex items-start gap-2 text-sm text-slate">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-ink" />
        <span>I agree to receive emails about new diamonds. I can unsubscribe at any time.</span>
      </label>
      {error && (
        <p id="newsletter-error" className="text-sm text-out">
          {error}
        </p>
      )}
    </form>
  );
}
