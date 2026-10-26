import Link from "next/link";
import { BadgeCheck, CalendarDays, Copy, ExternalLink, MessageCircle, RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { CompareToggle } from "@/components/product/CompareToggle";
import { SaveButton } from "@/components/product/SaveButton";
import { PincodeCheck } from "@/components/diamond/PincodeCheck";
import { ShareButton } from "@/components/diamond/ShareButton";
import { CopyText } from "@/components/diamond/CopyText";
import { clarityMeaning, colorGroup, cutLabel, originLabel } from "@/lib/catalog/labels";
import { compareAtPaise, isAvailable, mainVariant, pricePerCaratPaise, shortTitle } from "@/lib/catalog/product";
import { formatINR } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

/** Right-hand column of the diamond page: what it is, the price, and every way to buy or ask. */
export function BuyBox({ product }: { product: Product }) {
  const d = product.diamond;
  const variant = mainVariant(product);
  const available = isAvailable(product);
  const was = compareAtPaise(variant);
  const perCarat = pricePerCaratPaise(product);
  const title = d ? `${shortTitle(product)} ${originLabel(d.origin)} Diamond` : product.name;
  const wa = whatsappLink(`Hello Keian Luxandor, I have a question about the ${product.name}.`);
  const viewingHref = `/contact?type=viewing&diamond=${encodeURIComponent(product.slug)}#visit`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.08em]">
        {d && <span className="border border-line bg-stone px-2 py-1">{originLabel(d.origin)}</span>}
        {d && <span className="border border-line bg-stone px-2 py-1">{d.lab} certified</span>}
        {d?.quickShip && (
          <span className="inline-flex items-center gap-1 border border-line bg-stone px-2 py-1">
            <Zap className="size-3.5" aria-hidden /> Ships fast
          </span>
        )}
      </div>

      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{title}</h1>
      {variant && <p className="mt-2 text-sm text-slate">Stock number {variant.sku}</p>}

      {d && (
        <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          <GradeBox label="Carat" value={d.carat.toFixed(2)} note="Weight" />
          <GradeBox label="Colour" value={d.color} note={colorGroup(d.color)} />
          <GradeBox label="Clarity" value={d.clarity} note={clarityMeaning(d.clarity)} />
          <GradeBox label="Cut" value={cutLabel(d.cut)} note={d.cut ? "Light performance" : "Fancy shape"} />
        </dl>
      )}

      <div className="mt-6 border border-line bg-stone p-5">
        {variant && (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-serif text-4xl tabular-nums">{formatINR(variant.pricePaise)}</p>
            {was !== null && <p className="text-lg text-slate line-through tabular-nums">{formatINR(was)}</p>}
            <p className="text-sm text-slate">Includes GST</p>
          </div>
        )}
        {perCarat !== null && <p className="mt-1 text-sm text-slate">{formatINR(perCarat)} per carat</p>}
        <p className={cn("mt-3 flex items-center gap-2 text-sm", available ? "text-ok" : "text-out")}>
          <span className={cn("size-2 rounded-full", available ? "bg-ok" : "bg-out")} aria-hidden />
          {available ? "Available. This is the only one — the exact stone in the report." : "This diamond has been sold."}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <AddToCartButton product={product} className="w-full" />
          <AddToCartButton product={product} mode="buy" className="w-full" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
          <SaveButton product={product} withLabel />
          <CompareToggle slug={product.slug} name={title} variant="link" />
          <ShareButton title={title} />
        </div>
      </div>

      {d?.certificateNumber && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-line p-4 text-sm">
          <p className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-accent-deep" aria-hidden />
            <span>
              {d.lab} report <strong className="font-medium">{d.certificateNumber}</strong>
            </span>
            <CopyText text={d.certificateNumber} label="Copy report number">
              <Copy className="size-4" aria-hidden />
            </CopyText>
          </p>
          {d.verifyUrl && (
            <a href={d.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
              Verify on {d.lab} <ExternalLink className="size-4" aria-hidden />
            </a>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href={viewingHref} className="group border border-line p-4 transition-colors hover:border-ink">
          <p className="flex items-center gap-2 font-medium">
            <CalendarDays className="size-5 text-accent-deep" aria-hidden /> See it in person
          </p>
          <p className="mt-1 text-sm text-slate">Book a private viewing at our {site.address.line2 || site.address.city} showroom, {site.address.city}.</p>
          <span className="mt-2 inline-block text-sm font-medium underline underline-offset-4 group-hover:text-accent-deep">Book a viewing</span>
        </Link>
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="group border border-line p-4 transition-colors hover:border-ink">
            <p className="flex items-center gap-2 font-medium">
              <MessageCircle className="size-5 text-whatsapp" aria-hidden /> Ask us on WhatsApp
            </p>
            <p className="mt-1 text-sm text-slate">Ask for a video, more photos or a second opinion. We reply quickly.</p>
            <span className="mt-2 inline-block text-sm font-medium underline underline-offset-4 group-hover:text-accent-deep">Start a chat</span>
          </a>
        ) : (
          <Link href={`/contact?type=question&diamond=${encodeURIComponent(product.slug)}`} className="group border border-line p-4 transition-colors hover:border-ink">
            <p className="flex items-center gap-2 font-medium">
              <MessageCircle className="size-5 text-accent-deep" aria-hidden /> Ask about this diamond
            </p>
            <p className="mt-1 text-sm text-slate">Ask for a video, more photos or a second opinion.</p>
            <span className="mt-2 inline-block text-sm font-medium underline underline-offset-4 group-hover:text-accent-deep">Send a question</span>
          </Link>
        )}
      </div>

      <div className="mt-4">
        <PincodeCheck />
      </div>

      <ul className="mt-4 grid grid-cols-3 border border-line text-center text-sm">
        <li className="flex flex-col items-center gap-1 px-2 py-3">
          <ShieldCheck className="size-5 text-accent-deep" aria-hidden />
          Checked against its report
        </li>
        <li className="flex flex-col items-center gap-1 border-l border-line px-2 py-3">
          <Truck className="size-5 text-accent-deep" aria-hidden />
          Free insured delivery
        </li>
        <li className="flex flex-col items-center gap-1 border-l border-line px-2 py-3">
          <RotateCcw className="size-5 text-accent-deep" aria-hidden />
          {site.returnDays}-day returns
        </li>
      </ul>
    </div>
  );
}

function GradeBox({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-white p-3">
      <dt className="text-xs uppercase tracking-[0.08em] text-slate">{label}</dt>
      <dd className="mt-1 font-serif text-2xl leading-none">{value}</dd>
      <dd className="mt-1 text-xs text-slate">{note}</dd>
    </div>
  );
}
