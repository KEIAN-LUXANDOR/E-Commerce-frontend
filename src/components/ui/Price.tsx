import { formatINR } from "@/lib/format";

/** Displays a price from paise. "from" adds a prefix for products with several options. */
export function Price({ paise, from, className }: { paise: number; from?: boolean; className?: string }) {
  return (
    <span className={`tabular-nums ${className ?? ""}`}>
      {from && <span className="font-normal text-slate">From </span>}
      {formatINR(paise)}
    </span>
  );
}
