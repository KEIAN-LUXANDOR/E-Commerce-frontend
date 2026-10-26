"use client";

import { showToast } from "@/lib/stores";

/** Small button that copies text (e.g. a report number). */
export function CopyText({ text, label, children }: { text: string; label: string; children: React.ReactNode }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied.");
    } catch {
      showToast("Couldn’t copy. Select the text instead.", "error");
    }
  }
  return (
    <button type="button" onClick={copy} aria-label={label} title={label} className="grid size-8 place-items-center text-slate hover:bg-stone hover:text-ink">
      {children}
    </button>
  );
}
