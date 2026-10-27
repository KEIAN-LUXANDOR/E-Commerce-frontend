"use client";

import { Share2 } from "lucide-react";
import { showToast } from "@/lib/stores";

export function ShareButton({ title, text, url }: { title?: string; text?: string; url?: string }) {
  const handleShare = async () => {
    const shareData = {
      title: title || "Luxandor Diamond",
      text: text || "Check out this diamond",
      url: url || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Link copied to clipboard", { tone: "success" });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        showToast("Failed to share", { tone: "error" });
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center p-3 border border-line bg-surface hover:border-ink transition-colors"
      aria-label="Share"
    >
      <Share2 className="h-4 w-4 text-ink" />
    </button>
  );
}

export default ShareButton;