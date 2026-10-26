import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { phoneHref, site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Shown where a feature's backend isn't switched on yet (src/config/features.ts).
 * Always gives the shopper a way forward: WhatsApp, phone or the contact page.
 */
export function NotAvailableYet({
  title,
  children,
  whatsappText,
  className,
  compact,
}: {
  title: string;
  children?: React.ReactNode;
  /** Pre-filled WhatsApp message */
  whatsappText?: string;
  className?: string;
  compact?: boolean;
}) {
  const wa = whatsappLink(whatsappText);
  const tel = phoneHref();
  return (
    <div role="status" className={cn("border border-line bg-stone", compact ? "p-4" : "p-6 sm:p-8", className)}>
      <p className={cn("font-serif text-ink", compact ? "text-lg" : "text-2xl")}>{title}</p>
      {children && <div className="mt-2 max-w-prose text-sm leading-relaxed text-slate">{children}</div>}
      <div className="mt-4 flex flex-wrap gap-2">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MessageCircle className="size-4" aria-hidden /> WhatsApp us
          </a>
        )}
        {tel && (
          <a href={tel} className="btn btn-secondary">
            <Phone className="size-4" aria-hidden /> Call {site.phone}
          </a>
        )}
        <Link href="/contact" className="btn btn-secondary">
          Contact us
        </Link>
      </div>
    </div>
  );
}
