"use client";

import { Copy } from "lucide-react";
import { showToast } from "@/lib/stores";

export function CopyText({ text, label = "ID" }: { text: string; label?: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, { tone: "success" });
    } catch {
      showToast("Failed to copy", { tone: "error" });
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-ink transition-colors"
      title={`Copy ${label}`}
    >
      <span className="font-mono">{text}</span>
      <Copy className="h-3 w-3" />
    </button>
  );
}

export default CopyText;