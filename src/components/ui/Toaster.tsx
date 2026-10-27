"use client";

import { X } from "lucide-react";
import { toastStore, dismissToast } from "@/lib/stores";
import { cn } from "@/lib/utils";

/** Short confirmation and error messages, announced to screen readers. */
export function Toaster() {
  const toast = toastStore.useToast();

  if (!toast) return null;

  const tone = toast.tone || "default";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-[100] mx-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-[3px] border p-4 shadow-xl sm:left-auto sm:right-6 sm:mx-0 transition-all",
        tone === "error"
          ? "border-out bg-out text-white"
          : tone === "success"
          ? "border-ok bg-ok text-white"
          : "border-ink bg-ink text-white"
      )}
    >
      <p className="text-sm font-medium">{toast.message}</p>
      
      <button
        type="button"
        onClick={() => dismissToast()}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Toaster;