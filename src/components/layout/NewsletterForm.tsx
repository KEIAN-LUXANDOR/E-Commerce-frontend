"use client";

import { useState } from "react";
import { showToast } from "@/lib/stores";
import { isEnabled } from "@/config/features";
import { subscribeNewsletter } from "@/lib/api/support";

/**
 * Newsletter sign-up with explicit consent (required under India's DPDP Act).
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
      setError("Online newsletter subscription will open with our next catalog drop.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address like name@example.com.");
      return;
    }
    if (!consent) {
      setError("Please agree to receive updates about new certified diamonds.");
      return;
    }

    setBusy(true);
    setError(undefined);
    try {
      await subscribeNewsletter(email.trim());
      setEmail("");
      setConsent(false);
      showToast("Thank you for subscribing. You will receive private notifications when new stones arrive.", { tone: "success" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form noValidate className="mt-4 space-y-3" onSubmit={submit}>
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
          className="field text-sm bg-surface text-ink border border-line disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!enabled || busy}
          className="btn btn-primary shrink-0 disabled:opacity-60 text-xs uppercase tracking-wider"
        >
          {busy ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-slate select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={!enabled || busy}
          className="mt-0.5 size-3.5 accent-ink disabled:opacity-60"
        />
        <span>I agree to receive private alerts regarding new certified loose diamonds. Unsubscribe anytime.</span>
      </label>
      {error && (
        <p id="newsletter-error" className="text-xs text-out">
          {error}
        </p>
      )}
      {!enabled && (
        <p className="text-[11px] text-muted italic">
          Private Dispatch alerts are scheduled to go live with the upcoming collection.
        </p>
      )}
    </form>
  );
}

export default NewsletterForm;
