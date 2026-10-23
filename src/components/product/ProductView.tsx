"use client";

import { MessageCircle, Share2, ShieldCheck, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Gallery } from "@/components/product/Gallery";
import { PincodeCheck } from "@/components/product/PincodeCheck";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { Price } from "@/components/ui/Price";
import { cutLabel, diamondTitle, originLabel, originSlug, shapeSlug } from "@/lib/catalog-labels";
import { formatINR } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { addToCart, rememberViewed, setMiniCartOpen, setWhatsAppMessage, showToast } from "@/lib/stores";
import type { DiamondDetail } from "@/lib/types/catalog";

const ASSURANCES = [
  "Report number laser-inscribed on the girdle, checked by us before dispatch",
  "Shipped insured for its full value, signed for on delivery",
  "Returns within 30 days with the original report", // confirm your policy
];

/** Top half of the diamond page: gallery, grades summary, price and buying actions. */
export function ProductView({ diamond: d }: { diamond: DiamondDetail }) {
  const router = useRouter();
  const title = diamondTitle(d);
  const specLabel = `${d.color} colour, ${d.clarity}, ${cutLabel(d.cut)} cut, ${originLabel(d.origin).toLowerCase()}`;

  // Remember this stone for "Recently viewed" and name it in the WhatsApp button
  useEffect(() => {
    rememberViewed(d);
    setWhatsAppMessage(`Hello ${site.name}, I'd like to know more about the ${title} diamond, ${d.lab} ${d.certificateNumber} (${site.url}/product/${d.slug}).`);
    return () => setWhatsAppMessage(undefined);
  }, [d, title]);

  function add(goToCart: boolean) {
    const result = addToCart({
      diamondId: d.id,
      slug: d.slug,
      title,
      shape: d.shape,
      specLabel,
      certificateNumber: `${d.lab} ${d.certificateNumber}`,
      pricePaise: d.pricePaise,
    });
    if (goToCart) {
      router.push("/cart");
      return;
    }
    if (result === "already") showToast("This diamond is already in your cart.");
    setMiniCartOpen(true);
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `${title} diamond`, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast("Link copied");
      }
    } catch {
      // Shopper closed the share sheet
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
      <Gallery media={d.gallery} shape={d.shape} name={`${title} diamond`} />

      <div>
        <p className="text-sm text-slate">
          {originLabel(d.origin)} diamond, {d.lab} certified, SKU {d.sku}
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>

        {/* The four grades, large, because they decide the price */}
        <dl className="mt-6 grid grid-cols-4 border-y border-line">
          {[
            ["Carat", d.carat.toFixed(2)],
            ["Colour", d.color],
            ["Clarity", d.clarity],
            ["Cut", cutLabel(d.cut)],
          ].map(([k, v]) => (
            <div key={k} className="border-l border-line px-3 py-3 first:border-l-0 first:pl-0">
              <dt className="text-xs text-slate">{k}</dt>
              <dd className="mt-0.5 font-display text-xl tabular-nums sm:text-2xl">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Price paise={d.pricePaise} className="text-3xl font-medium" />
          <span className="text-sm text-slate">Including GST</span>
        </div>
        {d.emiFromPaise && d.available && (
          <p className="mt-1 text-sm text-slate">
            Or EMI from <span className="font-medium text-ink">{formatINR(d.emiFromPaise)}/month</span> on eligible cards
          </p>
        )}

        {d.available ? (
          <p className="mt-3 text-sm font-medium text-ok">Available. This is the only one: the exact stone in the report.</p>
        ) : (
          <div className="mt-4 border border-out/40 bg-surface p-4 text-sm">
            <p className="font-medium text-out">This diamond has been sold.</p>
            <p className="mt-1 text-slate">
              See similar stones below, or{" "}
              <Link href={`/shop/${originSlug(d.origin)}/${shapeSlug(d.shape)}`} className="link">
                browse all {originLabel(d.origin).toLowerCase()} {d.shape.toLowerCase()} diamonds
              </Link>
              .
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-primary flex-1" disabled={!d.available} onClick={() => add(false)}>
            {d.available ? "Add to cart" : "Sold"}
          </button>
          <button type="button" className="btn btn-secondary flex-1" disabled={!d.available} onClick={() => add(true)}>
            Buy now
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <WishlistButton slug={d.slug} name={title} withLabel className="inline-flex items-center gap-1.5 py-2 hover:text-loupe" />
          <button type="button" onClick={share} className="inline-flex items-center gap-1.5 py-2 hover:text-loupe">
            <Share2 className="size-5" aria-hidden /> Share
          </button>
          <a
            href={whatsappLink(`Hello ${site.name}, I would like to schedule a 40x live loupe video consultation for the ${title} diamond (${d.lab} ${d.certificateNumber}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-2 hover:text-loupe"
          >
            <Video className="size-5" aria-hidden /> 40x Loupe Video Call
          </a>
          <a
            href={whatsappLink(`Hello ${site.name}, I have a question about the ${title} diamond (${d.lab} ${d.certificateNumber}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-2 hover:text-loupe"
          >
            <MessageCircle className="size-5" aria-hidden /> Ask a gemologist
          </a>
        </div>

        <div className="mt-8">
          <PincodeCheck />
        </div>

        <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
          {ASSURANCES.map((h) => (
            <li key={h} className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-loupe" aria-hidden />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
