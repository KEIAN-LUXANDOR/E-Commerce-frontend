"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site, whatsappLink } from "@/lib/site";

/** Shown when a page fails to load (for example, the API is down). */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Phase F7: send to Application Insights instead of the console
    console.error(error);
  }, [error]);

  return (
    <div className="page max-w-2xl py-20">
      <h1 className="text-4xl">This page didn’t load</h1>
      <p className="mt-4 text-lg text-slate">
        The store couldn’t fetch this page just now. Try again, and if it keeps happening, message us and we’ll help you
        directly.
      </p>
      {error.digest && <p className="mt-2 text-sm text-slate">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Go to the home page
        </Link>
        <a href={whatsappLink(`Hello ${site.name}, a page on your website isn't loading.`)} className="btn" target="_blank" rel="noopener noreferrer">
          Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}
