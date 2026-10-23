"use client";

/**
 * buy-box.tsx
 *
 * The purchase action panel on the Diamond PDP.
 * Matches: mockups/1.02_ct_oval_diamond_detail_keian_luxandor/code.html
 *
 * Features:
 *   1. Integer-paise price with rupee display via formatINR.
 *   2. Live stock status badge (available / reserved).
 *   3. 4-grid key grades (Carat, Colour, Clarity, Cut) with sublabels.
 *   4. Primary "Add to Cart" + "Buy Now" checkout action.
 *   5. Quick actions: Wishlist, Share report, and Compare stone checkbox.
 *   6. 40x Loupe live video consultation + WhatsApp concierge cards.
 *   7. PIN-code serviceability checker with live feedback.
 *   8. 3-point trust strip (Checked before dispatch, Insured transit, 30-day returns).
 *   9. "View Grading Report" that opens CertificateModal.
 *
 * Zero nested ternaries in JSX.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  MapPin,
  FileText,
  AlertCircle,
  Loader2,
  Share2,
  Video,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import {
  addToCart,
  useWishlist,
  toggleWishlist,
  showToast,
  setWhatsAppMessage,
  useCompare,
  addToCompare,
  removeFromCompare,
} from "@/lib/stores";
import { mockPincode } from "@/mocks/catalog-service";
import type { CertificateLab, CutGrade, DiamondColor, Clarity, Fluorescence, Shape } from "@/lib/types/catalog";
import { CertificateModal } from "@/components/store/certificate-modal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BuyBoxProps {
  // Diamond identity
  diamondId: string;
  slug: string;
  title: string;
  shape: Shape;

  // Pricing (integer paise)
  pricePaise: number;
  /** Lowest monthly EMI from the server. Only shown when present. */
  emiFromPaise?: number;

  // Availability
  available: boolean;

  // Certificate data (passed down to CertificateModal)
  lab: CertificateLab;
  certificateNumber: string;
  certificateUrl?: string;
  carat: number;
  color: DiamondColor;
  clarity: Clarity;
  cut: CutGrade;
  polish: CutGrade;
  symmetry: CutGrade;
  fluorescence: Fluorescence;
  tablePct: number;
  depthPct: number;
  lwRatio: number;
  girdle: string;
  culet: string;
  laserInscription: boolean;
  measurements: { lengthMm: number; widthMm: number; depthMm: number };

  // Image for mini-cart
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// PIN-code checker state machine
// ---------------------------------------------------------------------------

type PinStatus = "idle" | "checking" | "ok" | "unavailable" | "invalid";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cutLabel(g: CutGrade): string {
  if (g === "EXCELLENT") return "Excellent";
  if (g === "VERY_GOOD") return "Very Good";
  return "Good";
}

function colorSublabel(c: DiamondColor): string {
  if (c <= "F") return "Colourless";
  if (c <= "H") return "Near colourless";
  return "Faint tint";
}

function claritySublabel(cl: Clarity): string {
  if (cl === "FL" || cl === "IF") return "Flawless";
  if (cl.startsWith("VVS")) return "Minute inclusions";
  if (cl.startsWith("VS")) return "Very slight inclusions";
  return "Eye clean";
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function BuyBox({
  diamondId,
  slug,
  title,
  shape,
  pricePaise,
  emiFromPaise,
  available,
  lab,
  certificateNumber,
  certificateUrl,
  carat,
  color,
  clarity,
  cut,
  polish,
  symmetry,
  fluorescence,
  tablePct,
  depthPct,
  lwRatio,
  girdle,
  culet,
  laserInscription,
  measurements,
  imageUrl,
}: BuyBoxProps) {
  const router = useRouter();
  const wishlist = useWishlist();
  const isWishlisted = wishlist.includes(slug);

  const compareSlugs = useCompare();
  const isCompared = compareSlugs.includes(slug);

  const [addedToCart, setAddedToCart] = React.useState(false);
  const [certOpen, setCertOpen] = React.useState(false);

  // PIN checker
  const [pinInput, setPinInput] = React.useState("411001");
  const [pinStatus, setPinStatus] = React.useState<PinStatus>("idle");
  const [pinMessage, setPinMessage] = React.useState("Estimated delivery by Friday to Pune.");

  // Pre-fill WhatsApp message for floating button
  React.useEffect(() => {
    const specLine = `${carat.toFixed(2)} ct ${shape}, ${color} ${clarity}, ${cutLabel(cut)} cut, ${lab} #${certificateNumber}`;
    setWhatsAppMessage(
      `Hi, I'm interested in the ${specLine} (${formatINR(pricePaise)}). Could you assist?`
    );
    return () => setWhatsAppMessage(undefined);
  }, [carat, shape, color, clarity, cut, lab, certificateNumber, pricePaise]);

  // ---- Actions ----

  function handleAddToCart() {
    if (!available) return;

    const result = addToCart({
      diamondId,
      slug,
      title,
      shape,
      specLabel: `${color} • ${clarity} • ${cutLabel(cut)} cut`,
      certificateNumber,
      pricePaise,
      imageUrl,
    });

    if (result === "already") {
      showToast("This stone is already in your reserve.", "info");
      return;
    }

    setAddedToCart(true);
    showToast("Stone reserved in your cart.", "info");
    setTimeout(() => setAddedToCart(false), 2500);
  }

  function handleBuyNow() {
    if (!available) return;

    addToCart({
      diamondId,
      slug,
      title,
      shape,
      specLabel: `${color} • ${clarity} • ${cutLabel(cut)} cut`,
      certificateNumber,
      pricePaise,
      imageUrl,
    });

    router.push("/checkout");
  }

  function handleWishlist() {
    toggleWishlist(slug);
  }

  function handleToggleCompare() {
    if (isCompared) {
      removeFromCompare(slug);
      showToast("Removed from comparison matrix.", "info");
      return;
    }
    const res = addToCompare(slug);
    if (res === "already") {
      showToast("Already in comparison matrix.", "info");
      return;
    }
    if (res === "full") {
      showToast("Comparison matrix is full (max 4 stones).", "error");
      return;
    }
    showToast("Added to comparison matrix.", "info");
  }

  async function handlePinCheck() {
    const cleaned = pinInput.replace(/\D/g, "").trim();
    if (cleaned.length !== 6) {
      setPinStatus("invalid");
      setPinMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    setPinStatus("checking");
    setPinMessage("");

    await new Promise<void>((resolve) => setTimeout(resolve, 450));

    const result = mockPincode(cleaned);

    if (!result.serviceable) {
      setPinStatus("unavailable");
      setPinMessage(
        result.state
          ? `Insured shipping is currently unavailable to ${result.state}.`
          : "Insured shipping is not available for this PIN code."
      );
      return;
    }

    const city = result.city ? `${result.city}, ` : "";
    const days =
      result.minDays === result.maxDays
        ? `${result.minDays} business days`
        : `${result.minDays}–${result.maxDays} business days`;

    setPinStatus("ok");
    setPinMessage(`Estimated delivery by ${days} to ${city}${result.state}.`);
  }

  function handlePinKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handlePinCheck();
  }

  // ---- Render ----

  const priceFormatted = formatINR(pricePaise);
  const emiFormatted = emiFromPaise ? formatINR(emiFromPaise) : null;
  const perCaratPaise = Math.round(pricePaise / Math.max(carat, 0.01));
  const perCaratFormatted = formatINR(perCaratPaise);

  let pinBorderClass = "border-[var(--color-line)]";
  if (pinStatus === "ok") pinBorderClass = "border-emerald-600";
  if (pinStatus === "unavailable" || pinStatus === "invalid") pinBorderClass = "border-red-500";

  let pinMessageClass = "text-[var(--color-slate)]";
  if (pinStatus === "ok") pinMessageClass = "text-emerald-700 font-medium";
  if (pinStatus === "unavailable" || pinStatus === "invalid") pinMessageClass = "text-red-600";

  return (
    <>
      <div className="flex flex-col">
        {/* 4 Key Grades Row matching mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F1F5F9] p-2 border border-[var(--color-line)] mb-6">
          <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--color-slate)]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Carat</span>
              <Sparkles className="size-3 text-[var(--color-muted)]" />
            </div>
            <div className="mt-2 font-serif text-[24px] text-[var(--color-ink)] font-normal">
              {carat.toFixed(2)}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-muted)]">Weight metric</div>
          </div>

          <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--color-slate)]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Colour</span>
              <Sparkles className="size-3 text-[var(--color-muted)]" />
            </div>
            <div className="mt-2 font-serif text-[24px] text-[var(--color-ink)] font-normal">
              {color}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-muted)]">{colorSublabel(color)}</div>
          </div>

          <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--color-slate)]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Clarity</span>
              <Sparkles className="size-3 text-[var(--color-muted)]" />
            </div>
            <div className="mt-2 font-serif text-[24px] text-[var(--color-ink)] font-normal">
              {clarity}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-muted)]">{claritySublabel(clarity)}</div>
          </div>

          <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--color-slate)]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Cut</span>
              <Sparkles className="size-3 text-[var(--color-muted)]" />
            </div>
            <div className="mt-2 font-serif text-[20px] text-[var(--color-ink)] font-normal">
              {cutLabel(cut)}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-muted)]">Symmetry & polish</div>
          </div>
        </div>

        {/* Price & Immediate Dispatch Box */}
        <div className="flex flex-col gap-2 bg-white p-5 border border-[var(--color-line)] shadow-xs mb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-[32px] font-medium text-[var(--color-ink)] tracking-tight">
              {priceFormatted}
            </span>
            <span className="text-xs text-[var(--color-muted)] font-mono">Including GST</span>
          </div>

          <div className="text-[12px] text-[var(--color-slate)] font-mono">
            {perCaratFormatted} per carat
            {emiFormatted && ` · Or EMI from ${emiFormatted}/month on eligible cards`}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-line)] flex items-center gap-2">
            <span className={cn("size-2 rounded-full", available ? "bg-[#2F6B4F]" : "bg-[var(--color-muted)]")} />
            <span className="font-mono text-xs text-[var(--color-ink)] font-medium tracking-wide">
              {available ? "Available for immediate dispatch from Surat vault" : "Reserved · Currently unavailable"}
            </span>
          </div>
        </div>

        {/* Action CTAs: Add to Cart + Buy Now */}
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!available}
              className={cn(
                "w-full h-12 font-mono text-xs uppercase tracking-widest transition-colors rounded-none flex items-center justify-center gap-2 text-white",
                available
                  ? addedToCart
                    ? "bg-[#2F6B4F]"
                    : "bg-[var(--canvas-dark,#0A192F)] hover:bg-black shadow-xs"
                  : "bg-[var(--color-stone)] text-[var(--color-muted)] cursor-not-allowed"
              )}
              aria-disabled={!available}
            >
              {addedToCart ? (
                <>
                  <Check className="size-4" /> Stone Reserved
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" /> {available ? "Add to Cart" : "Unavailable"}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!available}
              className="w-full h-12 bg-white text-[var(--color-ink)] border border-[var(--color-ink)] hover:bg-[#F1F5F9] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center rounded-none"
            >
              Buy Now
            </button>
          </div>

          {/* Micro Utility Actions Row */}
          <div className="flex items-center justify-between px-1 pt-1 text-xs text-[var(--color-slate)] select-none">
            <button
              type="button"
              onClick={handleWishlist}
              className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors py-1 cursor-pointer"
            >
              <Heart className={cn("size-4", isWishlisted && "fill-red-600 text-red-600")} />
              <span>{isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Diamond dossier link copied.", "info");
                }
              }}
              className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors py-1 cursor-pointer"
            >
              <Share2 className="size-4" />
              <span>Share Report</span>
            </button>

            <label className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompared}
                onChange={handleToggleCompare}
                className="w-3.5 h-3.5 rounded-none accent-[var(--color-ink)] cursor-pointer"
              />
              <span>Compare Stone</span>
            </label>
          </div>
        </div>

        {/* Concierge Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-white border border-[var(--color-line)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[var(--color-ink)] font-serif text-[16px]">
                <Video className="size-4 text-[var(--color-ink)]" />
                <span>40× Loupe Video Call</span>
              </div>
              <p className="text-xs text-[var(--color-slate)] mt-1.5 leading-snug">
                Inspect facets under live 40× digital macro magnification with our Surat lapidary atelier.
              </p>
            </div>
            <a
              href={`https://wa.me/919898552297?text=${encodeURIComponent(`Hi, I would like to schedule a 40x Loupe Video Consultation for the ${carat} ct ${shape} diamond (${lab} #${certificateNumber}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] font-semibold hover:underline flex items-center gap-1"
            >
              Schedule Video Call →
            </a>
          </div>

          <div className="p-4 bg-white border border-[var(--color-line)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#2F6B4F] font-serif text-[16px]">
                <MessageCircle className="size-4" />
                <span>WhatsApp Concierge</span>
              </div>
              <p className="text-xs text-[var(--color-slate)] mt-1.5 leading-snug">
                Ask a certified gemologist questions about proportions, certification, or transit.
              </p>
            </div>
            <a
              href={`https://wa.me/919898552297?text=${encodeURIComponent(`Hello Keian Luxandor, I am inquiring about the ${carat} ct ${shape} Diamond (${certificateNumber}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#2F6B4F] font-semibold hover:underline flex items-center gap-1"
            >
              Ask a Gemologist →
            </a>
          </div>
        </div>

        {/* Delivery PIN Check */}
        <div className="bg-white border border-[var(--color-line)] p-4 mb-6 shadow-xs">
          <label
            htmlFor="pin-input"
            className="block text-[11px] uppercase tracking-wider font-mono font-semibold text-[var(--color-ink)] mb-2"
          >
            Check delivery to your PIN code
          </label>
          <div className="flex gap-2">
            <div className={cn("flex-1 relative border", pinBorderClass)}>
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-slate)]"
                aria-hidden="true"
              />
              <input
                id="pin-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ""));
                  setPinStatus("idle");
                }}
                onKeyDown={handlePinKeyDown}
                placeholder="e.g. 411001"
                className="h-10 w-full bg-white pl-8 pr-3 font-mono text-xs text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none rounded-none"
                aria-label="Enter PIN code"
              />
            </div>
            <button
              type="button"
              onClick={handlePinCheck}
              disabled={pinStatus === "checking"}
              className="h-10 px-5 bg-[var(--color-ink)] text-white font-mono text-xs uppercase tracking-widest rounded-none hover:bg-black transition-colors disabled:opacity-60"
              aria-label="Check PIN code"
            >
              {pinStatus === "checking" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Check"
              )}
            </button>
          </div>

          {/* PIN result message */}
          {pinMessage && (
            <div className={cn("mt-2.5 text-xs flex items-center gap-1.5", pinMessageClass)}>
              {pinStatus === "ok" ? (
                <Check className="size-4 text-[#2F6B4F]" />
              ) : (
                <AlertCircle className="size-4 text-red-600" />
              )}
              <span>{pinMessage}</span>
            </div>
          )}
        </div>

        {/* 3 Trust Strip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F1F5F9] p-2.5 border border-[var(--color-line)] mb-6">
          <div className="flex items-start gap-2 p-1">
            <ShieldCheck className="size-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase font-semibold text-[var(--color-ink)]">
                Checked Before Dispatch
              </span>
              <span className="text-[10px] text-[var(--color-slate)]">In-house optical inspection</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-1">
            <Truck className="size-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase font-semibold text-[var(--color-ink)]">
                Insured to Your Door
              </span>
              <span className="text-[10px] text-[var(--color-slate)]">Full transit coverage</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-1">
            <RotateCcw className="size-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase font-semibold text-[var(--color-ink)]">
                30-Day Returns
              </span>
              <span className="text-[10px] text-[var(--color-slate)]">With original report</span>
            </div>
          </div>
        </div>

        {/* Laboratory Report Link */}
        <div className="border-t border-[var(--color-line)] pt-3 flex items-center justify-between text-xs text-[var(--color-slate)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-[#2F6B4F]" />
            <span>Graded by {lab} · Report #{certificateNumber}</span>
          </div>
          <button
            type="button"
            onClick={() => setCertOpen(true)}
            className="text-[var(--color-ink)] hover:underline font-mono text-[11px] uppercase tracking-wider flex items-center gap-0.5"
          >
            Inspect Report ↗
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        open={certOpen}
        onClose={() => setCertOpen(false)}
        lab={lab}
        certificateNumber={certificateNumber}
        certificateUrl={certificateUrl}
        carat={carat}
        shape={shape}
        color={color}
        clarity={clarity}
        cut={cut}
        polish={polish}
        symmetry={symmetry}
        fluorescence={fluorescence}
        tablePct={tablePct}
        depthPct={depthPct}
        lwRatio={lwRatio}
        girdle={girdle}
        culet={culet}
        laserInscription={laserInscription}
        measurements={measurements}
      />
    </>
  );
}
