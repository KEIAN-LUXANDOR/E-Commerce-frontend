"use client";

import { Share2 } from "lucide-react";
import { showToast } from "@/lib/stores";

/** Shares the page with the phone's share sheet, or copies the link on a computer. */
export function ShareButton({ title }: { title: string }) {
  async function onClick() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Closed the share sheet: nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied.");
    } catch {
      showToast("Couldn’t copy the link. Copy it from the address bar.", "error");
    }
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-11 items-center gap-2 px-1 text-sm hover:text-accent-deep">
      <Share2 className="size-5" aria-hidden /> Share
    </button>
  );
}
