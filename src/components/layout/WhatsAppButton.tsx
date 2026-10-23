"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { useWhatsAppMessage } from "@/lib/stores";

/**
 * Floating WhatsApp Concierge consultation button.
 * Context-aware: passes product context when browsing diamond PDPs.
 */
export function WhatsAppButton() {
  const customMessage = useWhatsAppMessage();

  let messageText = "Hello Keian Luxandor, I would like to inquire about certified loose diamonds.";
  if (customMessage) {
    messageText = customMessage;
  }

  const destinationHref = whatsappLink(messageText);

  return (
    <aside aria-label="Digital Concierge Floating Trigger">
      <a
        href={destinationHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[var(--color-ink)] text-white px-4 py-3 border border-white/20 shadow-[0_12px_28px_rgba(22,24,29,0.22)] hover:bg-[var(--color-loupe)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-loupe)] focus-visible:ring-offset-2"
        aria-label="Contact Diamond Concierge on WhatsApp"
      >
        <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-[0.08em] hidden sm:inline">
          Gemologist Concierge
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.08em] sm:hidden">
          Advisory
        </span>
      </a>
    </aside>
  );
}
