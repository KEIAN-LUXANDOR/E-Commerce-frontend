"use client";

import { ArrowLeftRight, Check } from "lucide-react";
import { COMPARE_LIMIT, showToast, toggleCompare, useCompare } from "@/lib/stores";
import { cn } from "@/lib/utils";

/** "Compare" tick box on cards and the diamond page (up to 4 diamonds). */
export function CompareToggle({ slug, name, className, variant = "checkbox" }: { slug: string; name: string; className?: string; variant?: "checkbox" | "link" }) {
  const list = useCompare();
  const selected = list.includes(slug);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(slug);
    if (result === "full") showToast(`You can compare up to ${COMPARE_LIMIT} diamonds. Remove one first.`, "error", { label: "Open compare", href: "/compare" });
  }

  if (variant === "link") {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={cn("inline-flex min-h-11 items-center gap-2 px-1 text-sm text-ink hover:text-accent-deep", className)}>
        <ArrowLeftRight className="size-5" aria-hidden />
        {selected ? "Added to compare" : "Compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={`Compare ${name}`}
      onClick={onClick}
      className={cn("inline-flex min-h-10 items-center gap-2 text-sm text-slate hover:text-ink", className)}
    >
      <span className={cn("grid size-4 place-items-center border", selected ? "border-ink bg-ink text-white" : "border-line-dark bg-white")}>
        {selected && <Check className="size-3" aria-hidden />}
      </span>
      Compare
    </button>
  );
}
