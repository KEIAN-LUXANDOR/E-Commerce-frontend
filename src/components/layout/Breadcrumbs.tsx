import Link from "next/link";
import { site } from "@/lib/site";
import type { Breadcrumb } from "@/lib/types/catalog";

/** Breadcrumb trail with BreadcrumbList structured data for Google. */
export function Breadcrumbs({ items, current }: { items: Breadcrumb[]; current: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [...items, { name: current, href: "" }].map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      ...(b.href ? { item: `${site.url}${b.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((b) => (
          <li key={b.href} className="flex items-center gap-2">
            <Link href={b.href} className="hover:text-ink hover:underline">
              {b.name}
            </Link>
            <span aria-hidden className="text-line">
              /
            </span>
          </li>
        ))}
        <li aria-current="page" className="text-ink">
          {current}
        </li>
      </ol>
      <script
        type="application/ld+json"
        // JSON-LD is built from our own data; "<" is escaped so text can't close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
