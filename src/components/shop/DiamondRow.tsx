import Link from "next/link";
import { DiamondCard } from "@/components/shop/DiamondCard";
import type { DiamondSummary } from "@/lib/types/catalog";

/** A titled row of up to four diamonds; hidden when there are none. */
export function DiamondRow({
  title,
  diamonds,
  link,
  id,
}: {
  title: string;
  diamonds: DiamondSummary[];
  link?: { href: string; label: string };
  id: string;
}) {
  if (!diamonds.length) return null;
  return (
    <section aria-labelledby={id}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className="text-3xl sm:text-4xl">
          {title}
        </h2>
        {link && (
          <Link href={link.href} className="link shrink-0 text-sm">
            {link.label}
          </Link>
        )}
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
        {diamonds.map((d) => (
          <li key={d.id}>
            <DiamondCard diamond={d} />
          </li>
        ))}
      </ul>
    </section>
  );
}
