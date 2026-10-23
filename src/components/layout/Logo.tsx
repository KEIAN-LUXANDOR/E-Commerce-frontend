import Link from "next/link";
import { FacetDiagram } from "@/components/art/FacetDiagram";
import { site } from "@/lib/site";

/** Wordmark with a small round-brilliant diagram. Replace with the real logo SVG when ready. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex min-w-0 items-center gap-2 sm:gap-2.5 ${className ?? ""}`} aria-label={`${site.name}, home`}>
      <svg viewBox="0 0 40 40" className="size-6 shrink-0 text-ink sm:size-7" aria-hidden>
        <FacetDiagram shape="ROUND" cx={20} cy={20} r={18} strokeWidth={1} />
      </svg>
      <span className="whitespace-nowrap font-display text-[1.0625rem] leading-none min-[400px]:text-[1.1875rem] tracking-[0.01em] sm:text-[1.375rem]">{site.name}</span>
    </Link>
  );
}
