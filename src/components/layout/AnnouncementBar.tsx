"use client";

import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { ShieldCheck, MessageSquare } from "lucide-react";

/**
 * Top announcement bar displayed across the entire luxury storefront.
 * Reinforces insured delivery, gemological certification, and direct advisory.
 * No showroom or physical store references.
 */
export function AnnouncementBar() {
  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-stone)] text-xs text-[var(--color-slate)]">
      <div className="page flex h-9 items-center justify-between gap-4">
        {/* Core Value Proposition */}
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[var(--color-loupe)]" aria-hidden="true" />
          <span className="truncate tracking-[0.03em]">
            Complimentary Insured Delivery Across India &bull; GIA &amp; IGI Certified Loose Diamonds
          </span>
        </div>

        {/* Digital Concierge Action Links */}
        <div className="hidden items-center gap-5 sm:flex text-[0.6875rem] font-medium uppercase tracking-[0.08em]">
          <a
            href={site.phoneHref}
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            {site.phone}
          </a>

          <a
            href={whatsappLink("Hello Keian Luxandor, I would like to speak with a gemologist.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[var(--color-loupe)] hover:text-[var(--color-loupe-deep)] transition-colors"
          >
            <MessageSquare className="h-3 w-3" aria-hidden="true" />
            <span>Digital Concierge</span>
          </a>

          <Link
            href="/legal/shipping"
            className="text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors"
          >
            Transit Insurance
          </Link>
        </div>
      </div>
    </div>
  );
}
