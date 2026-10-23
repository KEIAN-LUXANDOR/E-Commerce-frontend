"use client";

import Link from "next/link";
import { createLocalStore } from "@/lib/local-store";

const consentStore = createLocalStore<"unset" | "all" | "essential">("ad.cookie-consent.v1", "unset");

/** Read this before loading analytics (GA4 in Phase F5): only load when the value is "all". */
export const useCookieConsent = consentStore.useValue;

/** Asks once whether optional analytics cookies are allowed. Essential cookies (session, cart) are always on. */
export function CookieNotice() {
  const consent = consentStore.useValue();
  if (consent !== "unset") return null;
  return (
    <div role="region" aria-label="Cookie choices" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface">
      <div className="page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">
          We use essential cookies to keep you signed in and remember your cart. With your permission we also measure visits to
          improve the site. <Link href="/policies/privacy" className="link">Privacy policy</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => consentStore.set("essential")}>
            Essential only
          </button>
          <button type="button" className="btn btn-primary" onClick={() => consentStore.set("all")}>
            Allow all
          </button>
        </div>
      </div>
    </div>
  );
}
