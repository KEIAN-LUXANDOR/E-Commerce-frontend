"use client";

import { X } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/stores";

/** Short confirmation and error messages, announced to screen readers. */
export function Toaster() {
  const toasts = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-[4px] px-4 py-3 text-sm text-white shadow-[0_8px_24px_rgb(23_32_51/0.25)] ${
            t.tone === "error" ? "bg-out" : "bg-ink"
          }`}
        >
          <p className="flex-1">{t.message}</p>
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="-m-1 p-1 opacity-80 hover:opacity-100">
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
