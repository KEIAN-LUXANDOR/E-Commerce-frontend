import { cn } from "@/lib/utils";

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("gold-divider text-[0.55rem]", className)}
    >
      <span>◆</span>
    </div>
  );
}
