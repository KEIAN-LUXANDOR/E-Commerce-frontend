"use client";

/**
 * Cart Page
 * Route: /cart
 *
 * Directly aligns with Mockup: mockups/cart_bag_summary_keian_luxandor/code.html
 * - Breadcrumbs: Archive Home / Dossier Selection / Your Cart
 * - Header: "Your Cart" with "[X] Certified Single-Specimen Stones" technical badge
 * - Laboratory Ledger Head on each card:
 *     SPECIMEN NO. 01 | IGI/GIA [certNumber] | Natural/Lab-Grown · Type IIa/Conflict Free
 *     Available · Single Specimen badge with indicator
 * - Visualizer Well: 96px/112px stone tone well with "40× Loupe" or "GIA Plot" badge in corner
 * - 4-Column Spec Grid: Colour | Clarity | Cut Grade | Dimensions / Fluorescence
 * - Action Bar: Move to wishlist, Remove, and Inspect Dossier Certificate ↗
 * - Insured Transit Serviceability (PIN Code Checker) with verify state
 * - Sticky Order Summary with Coupon Code, GST, Armored Transit, and 40x Loupe Video Consultation Concierge
 * - Below the fold: Curated Cohort / Similar Diamonds carousel
 * - Zero nested ternaries in JSX
 */

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Gem,
  Heart,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ExternalLink,
  Tag,
  Check,
  Video,
  Sparkles,
} from "lucide-react";
import { useCart, removeFromCart, addToWishlist, showToast } from "@/lib/stores";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";
import { diamonds } from "@/mocks/data";
import { DiamondArt } from "@/components/art/DiamondArt";
import type { CartLine } from "@/lib/stores";

// ---------------------------------------------------------------------------
// Sub-component: Cart Specimen Card
// ---------------------------------------------------------------------------

function CartSpecimenCard({
  line,
  index,
}: {
  line: CartLine;
  index: number;
}) {
  function handleRemove() {
    removeFromCart(line.diamondId);
    showToast(`Specimen #${line.certificateNumber || line.diamondId} unlinked from cart.`, "info");
  }

  function handleMoveToWishlist() {
    addToWishlist(line.slug);
    removeFromCart(line.diamondId);
    showToast("Moved to your saved wishlist.", "info");
  }

  const originSegment = line.slug.includes("lab-grown") ? "lab-grown" : "natural";
  const isLabGrown = originSegment === "lab-grown";
  const specimenIndex = String(index + 1).padStart(2, "0");
  const certAuthority = line.certificateNumber?.startsWith("LG") ? "IGI" : "GIA";

  // Per carat equivalent calculation if available in title (e.g. 1.02 ct)
  const caratMatch = line.title.match(/([\d.]+)\s*ct/i);
  const caratVal = caratMatch ? parseFloat(caratMatch[1]) : 0;
  const perCaratPaise = caratVal > 0 ? Math.round(line.pricePaise / caratVal) : 0;

  // Extract specs or provide gemological defaults
  const specParts = line.specLabel.split("·").map((s) => s.trim());
  const colourSpec = specParts[0] || (isLabGrown ? "F, colourless" : "D, colourless");
  const claritySpec = specParts[1] || "VS1 (Eye-Clean)";
  const cutSpec = specParts[2] || "Ideal / Triple EX";
  const fourthSpec = isLabGrown ? "Type IIa (CVD)" : "Fluorescence: None";

  return (
    <article className="bg-white border border-[var(--color-line)] p-5 md:p-6 relative transition-all hover:border-[var(--color-slate)]">
      {/* Laboratory Ledger Head */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--color-line)]/70 text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#F1F5F9] text-[var(--color-ink)] font-semibold border border-[var(--color-line)]">
            SPECIMEN NO. {specimenIndex}
          </span>
          <span className="text-[var(--color-slate)] font-medium">
            {certAuthority} {line.certificateNumber || "REGISTERED"}
          </span>
          <span className="text-[var(--color-line-dark)]">|</span>
          <span className="text-[var(--color-slate)] uppercase">
            {isLabGrown ? "Cultivated · Type IIa" : "Natural Diamond · Conflict Free"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-800">
          <span className="size-2 rounded-full bg-emerald-600 inline-block"></span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">
            Available · Single Specimen
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Square Visualizer Well (#F1F5F9 stone tone) */}
        <div className="relative size-24 sm:size-28 flex-shrink-0 bg-[#F1F5F9] border border-[var(--color-line)] p-2 flex items-center justify-center group overflow-hidden">
          {line.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={line.imageUrl}
              alt={line.title}
              className="w-full h-full object-contain mix-blend-multiply opacity-90 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-16 h-16 text-[var(--color-ink)]">
              <DiamondArt shape={line.shape || "ROUND"} title={line.title} className="w-full h-full" />
            </div>
          )}
          <div className="absolute bottom-1 left-1 bg-white/95 px-1.5 py-0.5 border border-[var(--color-line)] text-[9px] font-mono text-[var(--color-ink)] uppercase font-semibold">
            {certAuthority === "GIA" ? "GIA Plot" : "40× Loupe"}
          </div>
        </div>

        {/* Diamond Data Details */}
        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <h2 className="font-serif text-[19px] sm:text-[21px] text-[var(--color-ink)] leading-snug font-normal">
                <Link
                  href={`/diamonds/${originSegment}/${line.slug}`}
                  className="hover:underline underline-offset-2"
                >
                  {line.title}
                </Link>
              </h2>
              <div className="text-left sm:text-right shrink-0">
                <p className="font-mono text-[20px] font-medium text-[var(--color-ink)] tabular-nums">
                  {formatINR(line.pricePaise)}
                </p>
                {perCaratPaise > 0 && (
                  <span className="font-mono text-[11px] text-[var(--color-slate)] block">
                    {formatINR(perCaratPaise)} / ct equivalent
                  </span>
                )}
              </div>
            </div>

            {/* 4-Column Spec Grid */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 border-y border-[var(--color-line)]/70 text-[12px]">
              <div>
                <span className="block text-[10px] font-mono text-[var(--color-slate)] uppercase tracking-wider">
                  Colour
                </span>
                <span className="font-medium text-[var(--color-ink)]">{colourSpec}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-[var(--color-slate)] uppercase tracking-wider">
                  Clarity
                </span>
                <span className="font-medium text-[var(--color-ink)]">{claritySpec}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-[var(--color-slate)] uppercase tracking-wider">
                  Cut Grade
                </span>
                <span className="font-medium text-[var(--color-ink)]">{cutSpec}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-[var(--color-slate)] uppercase tracking-wider">
                  Authentication
                </span>
                <span className="font-medium text-[var(--color-ink)]">{fourthSpec}</span>
              </div>
            </div>
          </div>

          {/* Item Actions */}
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)]/50 text-[12px]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMoveToWishlist}
                className="text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5"
              >
                <Heart className="size-3.5" />
                <span>Move to wishlist</span>
              </button>
              <span className="text-[var(--color-line-dark)]">·</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[var(--color-slate)] hover:text-red-700 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Remove</span>
              </button>
            </div>
            <div>
              <Link
                href={`/diamonds/${originSegment}/${line.slug}`}
                className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand-anchor,#0A192F)] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Inspect {certAuthority} Digital Dossier</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Insured Transit Serviceability (PIN Code Checker)
// ---------------------------------------------------------------------------

function InsuredTransitPincodeChecker() {
  const [pin, setPin] = React.useState("411001");
  const [status, setStatus] = React.useState<"idle" | "checked">("checked");
  const [cityName, setCityName] = React.useState("Pune");

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length === 6) {
      if (pin.startsWith("40") || pin.startsWith("41")) {
        setCityName(pin.startsWith("41") ? "Pune" : "Mumbai");
      } else if (pin.startsWith("11")) {
        setCityName("Delhi NCR");
      } else if (pin.startsWith("56")) {
        setCityName("Bengaluru");
      } else if (pin.startsWith("39")) {
        setCityName("Surat");
      } else {
        setCityName("Regional Hub");
      }
      setStatus("checked");
    }
  }

  return (
    <div className="bg-white border border-[var(--color-line)] p-5 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div>
          <span className="font-mono text-[11px] text-[var(--color-ink)] uppercase tracking-wider font-semibold block">
            Check Delivery
          </span>
          <p className="text-[13px] text-[var(--color-slate)] mt-0.5">
            Verify complimentary armored transit eligibility to your postal code
          </p>
        </div>
        <form onSubmit={handleVerify} className="flex items-center gap-2">
          <input
            id="pincode-input"
            type="text"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setStatus("idle");
            }}
            placeholder="PIN code"
            className="h-10 w-32 px-3 font-mono text-[13px] text-[var(--color-ink)] bg-[#F1F5F9] border border-[var(--color-line)] text-center tracking-widest outline-none focus:border-[var(--color-ink)]"
          />
          <button
            type="submit"
            className="h-10 px-4 bg-[var(--color-ink)] text-white font-mono text-[11px] uppercase tracking-wider hover:bg-black transition-colors shrink-0"
          >
            Verify
          </button>
        </form>
      </div>

      {status === "checked" && (
        <div className="pt-3 border-t border-[var(--color-line)]/60 flex items-start gap-2 text-[13px] text-[var(--color-slate)]">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>
            <strong className="text-[var(--color-ink)] font-medium">Serviceable:</strong>{" "}
            Insured armored delivery available to{" "}
            <span className="font-medium text-[var(--color-ink)] font-mono">{cityName} ({pin})</span>{" "}
            within 2–3 business days with tamper-evident security seal.
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Empty Cart View
// ---------------------------------------------------------------------------

function EmptyCart() {
  return (
    <div className="py-20 flex flex-col items-center gap-6 text-center border border-[var(--color-line)] bg-white p-8">
      <div className="grid size-20 place-items-center bg-[#F1F5F9] border border-[var(--color-line)]">
        <ShoppingBag className="size-8 text-[var(--color-slate)]" />
      </div>
      <div className="max-w-md">
        <h2 className="font-serif text-2xl text-[var(--color-ink)]">Your acquisition cart is empty</h2>
        <p className="text-[14px] text-[var(--color-slate)] mt-2 leading-relaxed">
          Every loose diamond in our registry is an authenticated single specimen holding an independent GIA or IGI laboratory dossier.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/shop?q=natural"
          className="flex h-12 items-center justify-center gap-2 px-6 bg-[var(--color-ink)] text-white text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-black transition-colors"
        >
          <Gem className="size-4" />
          Browse Natural Diamonds
        </Link>
        <Link
          href="/shop?q=lab"
          className="flex h-12 items-center justify-center gap-2 px-6 border border-[var(--color-line)] text-[var(--color-ink)] bg-white text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[#F1F5F9] transition-colors"
        >
          Browse Lab-Grown Diamonds
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function CartPage() {
  const lines = useCart();
  const isEmpty = lines.length === 0;

  // Pricing calculations
  const [couponCode, setCouponCode] = React.useState("WELCOME10K");
  const [couponApplied, setCouponApplied] = React.useState(true);
  const discountPaise = couponApplied ? 1000000 : 0; // ₹10,000

  const subtotalPaise = lines.reduce((acc, curr) => acc + curr.pricePaise, 0);
  const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const gstPaise = Math.round(discountedSubtotal * 0.03); // 3% statutory diamond GST
  const grandTotalPaise = discountedSubtotal + gstPaise;

  const whatsappMsg = `Hello Keian Luxandor Concierge, I would like to inquire about finalizing my acquisition dossier (${lines.length} certified specimen diamond${lines.length === 1 ? "" : "s"}, Total: ${formatINR(grandTotalPaise)}).`;

  // Curated cohort for the bottom section
  const recommendedDiamonds = React.useMemo(() => {
    return diamonds.slice(0, 4);
  }, []);

  return (
    <main className="bg-[#F8FAFC] min-h-screen text-[var(--color-ink)]">
      <section className="max-w-7xl w-full mx-auto px-6 md:px-10 pt-8 pb-16">
        {/* Breadcrumbs & Architectural Header */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 mb-4 text-[11px] font-mono uppercase tracking-wider text-[var(--color-slate)]"
        >
          <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
            Archive Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--color-ink)] transition-colors">
            Dossier Selection
          </Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-semibold">Your Cart</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-baseline justify-between pb-4 mb-8 border-b border-[var(--color-line)] gap-3">
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="font-serif text-[32px] sm:text-[40px] text-[var(--color-ink)] tracking-tight font-normal">
              Your Cart
            </h1>
            {!isEmpty && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand-anchor,#0A192F)] px-2.5 py-1 bg-[#F1F5F9] border border-[var(--color-line)] font-medium">
                {lines.length} Certified Single-Specimen {lines.length === 1 ? "Stone" : "Stones"}
              </span>
            )}
          </div>
          <div>
            <Link
              href="/shop"
              className="text-[12px] font-mono uppercase tracking-wider text-[var(--color-slate)] hover:text-[var(--color-ink)] transition-colors"
            >
              &larr; Return to Certified Inventory
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Cart Specimen Entries vs Sticky Order Summary */}
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Specimen Entries (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Specimen Cards List */}
              <div className="space-y-4">
                {lines.map((line, idx) => (
                  <CartSpecimenCard key={line.diamondId} line={line} index={idx} />
                ))}
              </div>

              {/* Insured Transit Serviceability (PIN Code Checker) */}
              <InsuredTransitPincodeChecker />
            </div>

            {/* Right Column: Sticky Order Summary Card (4 cols) */}
            <aside className="lg:col-span-4 sticky top-24 space-y-5">
              <div className="bg-white border border-[var(--color-line)] p-6 shadow-sm">
                <div className="pb-3 mb-5 border-b-2 border-[var(--color-ink)] border-double flex items-baseline justify-between">
                  <div>
                    <h2 className="font-serif text-[22px] text-[var(--color-ink)] tracking-tight font-normal">
                      Summary
                    </h2>
                    <span className="font-mono text-[10px] text-[var(--color-slate)] tracking-wider uppercase">
                      Order Invoice
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--color-slate)]">
                    {lines.length} {lines.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[13px]">
                  <div className="flex justify-between items-center text-[var(--color-slate)]">
                    <span>Specimens Subtotal</span>
                    <span className="text-[var(--color-ink)] tabular-nums font-medium">
                      {formatINR(subtotalPaise)}
                    </span>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="pt-2 pb-1 font-sans">
                    <label className="block font-mono text-[10px] text-[var(--color-slate)] uppercase tracking-wider mb-1">
                      Privilege Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="h-9 px-3 w-full font-mono text-[11px] text-[var(--color-ink)] bg-[#F1F5F9] border border-[var(--color-line)] uppercase outline-none focus:border-[var(--color-ink)]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (couponCode.trim()) {
                            setCouponApplied(true);
                            showToast("Privilege code applied.", "info");
                          }
                        }}
                        className="h-9 px-3 bg-[var(--color-ink)] text-white font-mono text-[11px] uppercase tracking-wider border border-[var(--color-line)] hover:bg-black transition-colors shrink-0"
                      >
                        Apply
                      </button>
                    </div>

                    {couponApplied && (
                      <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 bg-[#F1F5F9] border border-[var(--color-line)] text-[11px] font-mono">
                        <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                          <Check className="size-3 text-emerald-700" />
                          −₹10,000 (Concierge Welcome)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCouponApplied(false);
                            setCouponCode("");
                          }}
                          className="text-[var(--color-slate)] hover:text-red-700"
                          title="Remove promotion"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Armored Transit */}
                  <div className="flex justify-between items-center text-[var(--color-slate)] pt-2">
                    <div className="flex items-center gap-1">
                      <span>Armored Transit &amp; Insurance</span>
                    </div>
                    <span className="text-emerald-800 font-mono text-[11px] uppercase font-bold tracking-wider">
                      Free (Insured)
                    </span>
                  </div>

                  {/* Statutory GST */}
                  <div className="flex justify-between items-center text-[var(--color-slate)]">
                    <span>GST (3% Indian Precious Metal &amp; Gems)</span>
                    <span className="text-[var(--color-ink)] tabular-nums">
                      {formatINR(gstPaise)}
                    </span>
                  </div>
                </div>

                <div className="my-5 border-t border-[var(--color-line)]"></div>

                {/* Grand Total */}
                <div className="flex justify-between items-baseline mb-6">
                  <div>
                    <span className="font-serif text-[20px] text-[var(--color-ink)] block tracking-tight">
                      Total
                    </span>
                    <span className="font-mono text-[10px] text-[var(--color-slate)]">
                      All taxes &amp; insured transit included
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[24px] text-[var(--color-ink)] font-bold tabular-nums">
                      {formatINR(grandTotalPaise)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full h-12 bg-[var(--canvas-dark,#0A192F)] text-white hover:bg-black transition-colors flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-widest text-center shadow-sm"
                >
                  <span>Check Out Securely</span>
                  <ArrowRight className="size-4" />
                </Link>

                <div className="mt-5 pt-4 border-t border-[var(--color-line)]/60 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[var(--color-slate)] text-[11px] font-mono text-center">
                    <ShieldCheck className="size-3.5 text-emerald-700" />
                    <span>Cards · Net Banking · UPI · Major Bank EMI</span>
                  </div>
                  <p className="text-[10px] font-mono text-[var(--color-slate)] text-center leading-normal">
                    Tamper-evident insured dispatch with physical laboratory certificates.
                  </p>
                </div>
              </div>

              {/* Private Client Concierge Box (Surat Atelier & 40x Loupe Video Consultation) */}
              <div className="bg-[#F1F5F9] border border-[var(--color-line)] p-5 text-[13px] space-y-2.5">
                <div className="flex items-center gap-2 text-[var(--color-ink)] font-medium">
                  <Video className="size-4 text-[var(--brand-anchor,#0A192F)]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
                    40× Loupe Video Consultation
                  </span>
                </div>
                <p className="text-[var(--color-slate)] text-[12px] leading-relaxed">
                  Require specialized microscopic examination before settlement? An institutional lapidary gemologist can broadcast these exact stones under 40× live optical magnification.
                </p>
                <a
                  href={whatsappLink(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand-anchor,#0A192F)] font-mono text-[11px] uppercase tracking-wider hover:underline flex items-center gap-1 pt-1 font-semibold"
                >
                  <span>Request Live 40× Session On WhatsApp</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* Below the Fold: Curated Cohort / Similar Diamonds Carousel */}
      <section className="w-full bg-[#F1F5F9] border-t border-[var(--color-line)] py-14 mt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-8 border-b border-[var(--color-line)] gap-3">
            <div>
              <span className="font-mono text-[11px] text-[var(--brand-anchor,#0A192F)] uppercase tracking-widest block mb-1">
                Recommendations
              </span>
              <h2 className="font-serif text-[26px] sm:text-[30px] text-[var(--color-ink)] tracking-tight font-normal">
                You might also like
              </h2>
            </div>
            <p className="text-[13px] text-[var(--color-slate)] max-w-md">
              Certified specimens presenting matching optical geometry, color fidelity, and verified proportions.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedDiamonds.map((d) => {
              const originType = d.origin === "NATURAL" ? "natural" : "lab-grown";
              return (
                <div
                  key={d.id}
                  className="bg-white border border-[var(--color-line)] p-4 flex flex-col justify-between hover:border-[var(--color-slate)] transition-all group"
                >
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-slate)] mb-2">
                      <span className="px-1.5 py-0.5 bg-[#F1F5F9] text-[var(--color-ink)] border border-[var(--color-line)]">
                        {d.lab} {d.certificateNumber}
                      </span>
                      <span className={d.origin === "NATURAL" ? "font-medium text-[var(--color-ink)]" : "text-emerald-800"}>
                        {d.origin === "NATURAL" ? "Natural" : "Lab-Grown"}
                      </span>
                    </div>

                    <div className="h-36 bg-[#F1F5F9] border border-[var(--color-line)] flex items-center justify-center p-3 mb-3 relative overflow-hidden">
                      {d.media?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.media[0].url}
                          alt={d.seo?.title || `${d.carat.toFixed(2)} ct ${d.shape} Diamond`}
                          className="h-full w-auto object-contain mix-blend-multiply opacity-85 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-16 h-16 text-[var(--color-ink)]">
                          <DiamondArt shape={d.shape} title={d.seo?.title || `${d.carat.toFixed(2)} ct ${d.shape} Diamond`} className="w-full h-full" />
                        </div>
                      )}
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[var(--color-slate)] bg-white px-1.5 py-0.5 border border-[var(--color-line)]">
                        {d.carat.toFixed(2)} ct
                      </span>
                    </div>

                    <h3 className="font-serif text-[17px] text-[var(--color-ink)] tracking-tight font-normal">
                      {d.carat.toFixed(2)} ct {d.shape} Diamond
                    </h3>
                    <p className="text-[12px] text-[var(--color-slate)] mt-1 font-mono">
                      {d.color} · {d.clarity} · {d.cut}
                    </p>
                    <p className="text-[10px] text-[var(--color-slate)] font-mono mt-0.5">
                      Table {d.tablePct ? `${d.tablePct}%` : "58%"} · Depth {d.depthPct ? `${d.depthPct}%` : "62%"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-line)]/60 flex items-center justify-between">
                    <span className="font-mono text-[14px] font-bold text-[var(--color-ink)] tabular-nums">
                      {formatINR(d.pricePaise)}
                    </span>
                    <Link
                      href={`/diamonds/${originType}/${d.slug}`}
                      className="px-3 py-1 bg-[#F1F5F9] hover:bg-[var(--color-ink)] hover:text-white transition-colors text-[var(--color-ink)] font-mono text-[10px] uppercase tracking-wider border border-[var(--color-line)]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
