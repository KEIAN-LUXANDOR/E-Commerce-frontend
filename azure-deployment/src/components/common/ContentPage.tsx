import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { whatsappLink } from "@/lib/site";
import type { Breadcrumb } from "@/lib/types/catalog";

/** Layout for text pages (policies, guides): title, intro, readable column and a help box. */
export function ContentPage({
  eyebrow,
  title,
  intro,
  crumbs = [{ name: "Home", href: "/" }],
  updated,
  children,
  aside = true,
  hero,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  crumbs?: Breadcrumb[];
  /** "Last updated" line for policies */
  updated?: string;
  children: React.ReactNode;
  aside?: boolean;
  hero?: React.ReactNode;
}) {
  const wa = whatsappLink("Hello Keian Luxandor, I have a question.");
  return (
    <div className="pb-8">
      <div className="border-b border-line bg-stone">
        <div className="page py-10 sm:py-12">
          <Breadcrumbs items={crumbs} current={title} />
          {eyebrow && <p className="section-eyebrow mt-6">{eyebrow}</p>}
          <h1 className={eyebrow ? "mt-2 text-4xl sm:text-5xl" : "mt-6 text-4xl sm:text-5xl"}>{title}</h1>
          {intro && <div className="mt-4 max-w-2xl text-lg leading-relaxed text-slate">{intro}</div>}
          {updated && <p className="mt-3 text-sm text-slate">Last updated {updated}</p>}
        </div>
      </div>
      {hero && <div className="page mt-10">{hero}</div>}
      <div className="page mt-10 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <div className="prose-page">{children}</div>
        {aside && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line p-5">
              <p className="font-serif text-2xl">Still have a question?</p>
              <p className="mt-2 text-sm text-slate">Talk to a real person. We usually reply within a few hours on working days.</p>
              <div className="mt-4 flex flex-col gap-2">
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp us
                  </a>
                )}
                <Link href="/contact" className="btn btn-secondary">
                  Contact us
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
