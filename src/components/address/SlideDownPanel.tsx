"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SlideDownPanelProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

/** Accessible height-animated disclosure that respects reduced motion. */
export function SlideDownPanel({
  open,
  children,
  className,
  innerClassName,
}: SlideDownPanelProps) {
  return (
    <div
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className={cn("pt-3", innerClassName)}>{children}</div>
      </div>
    </div>
  );
}
