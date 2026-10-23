"use client";

import * as React from "react";
import {
  MessageCircle,
  Share2,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Check,
  Video,
  Truck,
  RotateCcw,
  Sparkles,
  MapPin,
  Loader2,
  AlertCircle,
  ExternalLink,
  Copy,
  ZoomIn,
  Expand,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WishlistButton } from "@/components/store/WishlistButton";
import { formatINR } from "@/lib/format";
import { mainVariant, shapeFromName, showMrp } from "@/lib/product-display";
import { site, whatsappLink } from "@/lib/site";
import {
  addToCart,
  rememberProduct,
  setMiniCartOpen,
  setWhatsAppMessage,
  showToast,
  useWishlist,
  toggleWishlist,
} from "@/lib/stores";
import { mockPincode } from "@/mocks/catalog-service";
import type { StoreProduct, StoreVariant } from "@/lib/types/store";
import type { Shape } from "@/lib/types/catalog";
import { DiamondArt } from "@/components/art/DiamondArt";
import { cn } from "@/lib/utils";

type PinStatus = "idle" | "checking" | "ok" | "unavailable" | "invalid";

/**
 * StoreProductView
 *
 * Full two-column archival specimen workbench matching:
 * mockups/1.02_ct_oval_diamond_detail_keian_luxandor/code.html
 *
 * Zero nested ternaries in JSX.
 */
export function StoreProductView({ product }: { product: StoreProduct }) {
  const router = useRouter();
  const variants = [...product.variants].sort((a, b) => a.pricePaise - b.pricePaise);
  const [variantId, setVariantId] = React.useState(mainVariant(product)?.id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const shape: Shape = shapeFromName(product.name) ?? "ROUND";

  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [added, setAdded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"overview" | "grading" | "certificate" | "shipping">("overview");
  const [copied, setCopied] = React.useState(false);
  const [spotlight, setSpotlight] = React.useState({ x: 0, y: 0, active: false });

  // PIN code checker
  const [pinInput, setPinInput] = React.useState("411001");
  const [pinStatus, setPinStatus] = React.useState<PinStatus>("idle");
  const [pinMessage, setPinMessage] = React.useState("Estimated delivery by Friday to Pune.");

  const wishlist = useWishlist();
  const isWishlisted = wishlist.includes(product.slug);

  const isLabGrown =
    product.name.toLowerCase().includes("lab") ||
    (product.description?.toLowerCase().includes("lab") ?? false);

  const originLabel = isLabGrown ? "Lab-Grown Diamond" : "Natural Diamond";
  const sku = variant?.sku ?? "KL-SPEC-1027";

  // Pre-fill WhatsApp message
  React.useEffect(() => {
    rememberProduct(product);
    setWhatsAppMessage(
      `Hello ${site.name}, I would like to inquire about ${product.name} (SKU: ${sku}).`
    );
    return () => setWhatsAppMessage(undefined);
  }, [product, sku]);

  function handleAddToCart(goToCheckout = false) {
    if (!variant || !variant.inStock) return;

    const res = addToCart({
      diamondId: variant.id,
      slug: product.slug,
      title: product.name,
      imageUrl: product.images[0]?.url,
      shape,
      specLabel: variants.length > 1 ? `${variant.name}, SKU ${variant.sku}` : `SKU ${variant.sku}`,
      certificateNumber: variant.sku,
      pricePaise: variant.pricePaise,
    });

    if (goToCheckout) {
      router.push("/checkout");
      return;
    }

    if (res === "already") {
      showToast("This stone is already reserved in your cart.", "info");
      return;
    }

    setAdded(true);
    showToast("Stone reserved in your cart.", "info");
    setMiniCartOpen(true);
    setTimeout(() => setAdded(false), 2500);
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Specimen dossier URL copied to clipboard.", "info");
      }
    } catch {
      // User closed share sheet
    }
  }

  async function handlePinCheck() {
    const cleaned = pinInput.replace(/\D/g, "").trim();
    if (cleaned.length !== 6) {
      setPinStatus("invalid");
      setPinMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    setPinStatus("checking");
    await new Promise((r) => setTimeout(r, 450));

    const res = mockPincode(cleaned);
    if (!res.serviceable) {
      setPinStatus("unavailable");
      setPinMessage("Insured regional transit not available to this area code.");
      return;
    }

    const city = res.city ? `${res.city}, ` : "";
    setPinStatus("ok");
    setPinMessage(`Estimated insured delivery in ${res.minDays}–${res.maxDays} days to ${city}${res.state}.`);
  }

  function handleCopyReport() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(sku);
      setCopied(true);
      showToast(`Specimen ID ${sku} copied.`, "info");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Derive display specs
  const activeImage = product.images[activeMediaIndex] ?? product.images[0];
  const emiEstimate = variant ? Math.round(variant.pricePaise / 12) : 0;
  function moveSpotlight(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      active: true,
    });
  }

  let pinBorderClass = "border-[var(--color-line)]";
  if (pinStatus === "ok") pinBorderClass = "border-emerald-600";
  if (pinStatus === "unavailable" || pinStatus === "invalid") pinBorderClass = "border-red-500";

  return (
    <div className="w-full flex flex-col gap-12">
      {/* TWO-COLUMN ARCHIVAL SPECIMEN WORKBENCH */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-x-12 gap-y-10 items-start">
        {/* LEFT COLUMN: ARCHIVAL GALLERY INSPECTION WELL */}
        <div className="lg:sticky lg:top-24 flex flex-col md:flex-row gap-4 w-full">
          {/* Vertical Thumbnail Rail */}
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 select-none shrink-0">
            {product.images.map((img, i) => {
              const isActive = i === activeMediaIndex;
              return (
                <button
                  key={img.url ?? i}
                  type="button"
                  onClick={() => setActiveMediaIndex(i)}
                  className={cn(
                    "w-16 h-16 p-1 border transition-all duration-150 flex flex-col items-center justify-center relative rounded-none",
                    isActive
                      ? "border-[var(--color-ink)] bg-white ring-1 ring-[var(--brand-accent,#D4AF37)] shadow-xs"
                      : "border-[var(--color-line)] bg-[#F6F4EF] hover:border-[var(--color-ink)]"
                  )}
                >
                  <span className="absolute top-1 left-1 font-mono text-[8px] text-[var(--color-slate)] uppercase leading-none">
                    0{i + 1}
                  </span>
                  <div className="w-8 h-8 relative flex items-center justify-center">
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt=""
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <DiamondArt shape={shape} title="" className="w-full h-full text-[var(--color-ink)]" />
                    )}
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-tighter mt-1 text-[var(--color-slate)]">
                    {i === 0 ? "Face-up" : i === 1 ? "Profile" : "Angle"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Platinum/Stone Inspection Well */}
          <div
            className="relative flex-1 order-1 md:order-2 bg-[#F6F4EF] border border-[var(--color-line)] overflow-hidden shadow-xs aspect-square select-none group"
            onPointerMove={moveSpotlight}
            onPointerLeave={() => setSpotlight((current) => ({ ...current, active: false }))}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-200"
              style={{
                opacity: spotlight.active ? 1 : 0,
                background: `radial-gradient(520px circle at ${spotlight.x}px ${spotlight.y}px, rgba(212, 175, 55, 0.17), transparent 48%)`,
              }}
            />
            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center pointer-events-none z-10">
              <div className="flex items-center gap-1.5 bg-white/95 border border-[var(--color-line)] px-2.5 py-1">
                <ZoomIn className="size-3.5 text-[var(--color-ink)]" />
                <span className="font-mono text-[11px] text-[var(--color-ink)] uppercase tracking-wider">
                  High-resolution diamond viewer
                </span>
              </div>
              <div className="bg-white/95 border border-[var(--color-line)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-slate)]">
                SKU: {sku}
              </div>
            </div>

            {/* Media Visualizer Canvas */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              {activeImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage.url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-48 h-48 max-w-full max-h-full text-[var(--color-ink)]">
                  <DiamondArt shape={shape} title={product.name} className="w-full h-full" />
                </div>
              )}
            </div>

            {/* Bottom Bar: Fullscreen & Laser Inscription Notice */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white/90 to-transparent flex items-center justify-between border-t border-[var(--color-line)]/50">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-ink)] uppercase tracking-wider">
                <Expand className="size-3.5" />
                <span>40× Optical Loupe Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[var(--color-slate)]">Laser Inscription on Girdle</span>
                <span className="h-2 w-2 rounded-full bg-[#2F6B4F]" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BUY BOX ARCHIVE & ACQUISITION SUITE */}
        <div className="flex flex-col gap-6">
          {/* Header & Badges */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-white text-[var(--color-ink)] font-mono text-[11px] uppercase tracking-wider border border-[var(--color-line)] font-medium">
                {originLabel}
              </span>
              <span className="px-2.5 py-0.5 bg-white text-[var(--color-slate)] font-mono text-[11px] uppercase tracking-wider border border-[var(--color-line)] flex items-center gap-1">
                <ShieldCheck className="size-3 text-[#2F6B4F]" />
                IGI / GIA Graded
              </span>
              <span className="font-mono text-[11px] text-[var(--color-muted)]">
                SKU: {sku}
              </span>
            </div>

            <h1 className="font-serif text-[32px] sm:text-[38px] leading-tight font-normal text-[var(--color-ink)] mt-1">
              {product.name}
            </h1>
            <p className="text-[13px] text-[var(--color-slate)] leading-relaxed">
              Certified precision diamond specimen from our Surat atelier, laser-inscribed and insured for transit across India.
            </p>
          </div>

          {/* 4 Key Grades Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F6F4EF] p-2 border border-[var(--color-line)]">
            <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--color-slate)]">
                <span className="font-mono text-[10px] uppercase tracking-wider">Carat</span>
                <Sparkles className="size-3 text-[var(--color-muted)]" />
              </div>
              <div className="mt-2 font-serif text-[22px] text-[var(--color-ink)] font-normal">
                {variant?.name.split(" ")[0] ?? "1.02"}
              </div>
              <div className="font-mono text-[10px] text-[var(--color-muted)]">Weight metric</div>
            </div>

            <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--color-slate)]">
                <span className="font-mono text-[10px] uppercase tracking-wider">Colour</span>
                <Sparkles className="size-3 text-[var(--color-muted)]" />
              </div>
              <div className="mt-2 font-serif text-[22px] text-[var(--color-ink)] font-normal">
                F
              </div>
              <div className="font-mono text-[10px] text-[var(--color-muted)]">Colourless grade</div>
            </div>

            <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--color-slate)]">
                <span className="font-mono text-[10px] uppercase tracking-wider">Clarity</span>
                <Sparkles className="size-3 text-[var(--color-muted)]" />
              </div>
              <div className="mt-2 font-serif text-[22px] text-[var(--color-ink)] font-normal">
                VS1
              </div>
              <div className="font-mono text-[10px] text-[var(--color-muted)]">Very slight inclusions</div>
            </div>

            <div className="bg-white p-3 border border-[var(--color-line)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--color-slate)]">
                <span className="font-mono text-[10px] uppercase tracking-wider">Cut</span>
                <Sparkles className="size-3 text-[var(--color-muted)]" />
              </div>
              <div className="mt-2 font-serif text-[20px] text-[var(--color-ink)] font-normal">
                Excellent
              </div>
              <div className="font-mono text-[10px] text-[var(--color-muted)]">Symmetry &amp; Polish</div>
            </div>
          </div>

          {/* Pricing & Acquisition Block */}
          {variant ? (
            <div className="flex flex-col gap-2 bg-white p-5 border border-[var(--color-line)] shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-[36px] font-medium text-[var(--color-ink)] tracking-tight">
                  {formatINR(variant.pricePaise)}
                </span>
                {showMrp(variant) && (
                  <span className="text-sm text-[var(--color-muted)] line-through">
                    {formatINR(variant.mrpPaise!)}
                  </span>
                )}
                <span className="text-xs text-[var(--color-muted)] font-mono">Including GST</span>
              </div>

              {emiEstimate > 0 && (
                <div className="flex items-center gap-2 text-[var(--color-slate)] text-xs font-mono">
                  <span>Or EMI from <strong className="text-[var(--color-ink)] font-semibold">{formatINR(emiEstimate)}/month</strong> on eligible credit cards</span>
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-[var(--color-line)] flex items-center gap-2">
                <span className={cn("size-2 rounded-full", variant.inStock ? "bg-[#2F6B4F]" : "bg-red-500")} />
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium tracking-wide">
                  {variant.inStock ? "Available for immediate dispatch from Surat vault" : "Reserved / Currently unavailable"}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white border border-[var(--color-line)] text-sm text-[var(--color-slate)]">
              This specimen is available upon inquiry. Contact our Surat atelier.
            </div>
          )}

          {/* Variant Selector (if multi-specimen) */}
          {variants.length > 1 && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-slate)]">
                Select Specimen Variant:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {variants.map((v) => {
                  const isSelected = v.id === variantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      className={cn(
                        "p-2.5 text-left border flex items-center justify-between text-xs transition-colors rounded-none",
                        isSelected
                          ? "border-[var(--color-ink)] bg-white ring-1 ring-[var(--color-ink)] font-medium"
                          : "border-[var(--color-line)] bg-white hover:border-[var(--color-ink)]"
                      )}
                    >
                      <span className={v.inStock ? "" : "line-through text-[var(--color-muted)]"}>
                        {v.name}
                      </span>
                      <span className="font-mono font-medium text-[var(--color-ink)]">
                        {formatINR(v.pricePaise)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Acquisition CTAs */}
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={!variant?.inStock}
                onClick={() => handleAddToCart(false)}
                className={cn(
                  "h-12 font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none",
                  variant?.inStock
                    ? added
                      ? "bg-[#2F6B4F] text-white"
                      : "bg-[var(--brand-accent)] text-[var(--canvas-dark)] hover:bg-[var(--brand-accent-muted)] shadow-[0_4px_16px_rgba(212,175,55,0.18)]"
                    : "bg-[var(--color-stone)] text-[var(--color-muted)] cursor-not-allowed"
                )}
              >
                {added ? (
                  <>
                    <Check className="size-4" /> Reserved in Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={!variant?.inStock}
                onClick={() => handleAddToCart(true)}
                className="h-12 bg-white text-[var(--color-ink)] border border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/10 font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center rounded-none"
              >
                Buy Now
              </button>
            </div>

            {/* Micro Utility Actions */}
            <div className="flex items-center justify-between px-1 pt-1 text-xs text-[var(--color-slate)] select-none">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.slug);
                }}
                className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors py-1"
              >
                <Heart className={cn("size-4", isWishlisted && "fill-red-600 text-red-600")} />
                <span>{isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors py-1"
              >
                <Share2 className="size-4" />
                <span>Share Specimen</span>
              </button>

              <a
                href={whatsappLink(`Hello ${site.name}, I am inquiring about ${product.name} (SKU: ${sku}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#2F6B4F] hover:underline font-medium py-1"
              >
                <MessageCircle className="size-4" />
                <span>Ask Gemologist</span>
              </a>
            </div>
          </div>

          {/* Concierge Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-white border border-[var(--color-line)] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-ink)] font-serif text-[16px]">
                  <Video className="size-4 text-[var(--color-ink)]" />
                  <span>40× Loupe Video Call</span>
                </div>
                <p className="text-xs text-[var(--color-slate)] mt-1.5 leading-snug">
                  Inspect facets under live 40× digital macro magnification with our Surat lapidary master.
                </p>
              </div>
              <a
                href={`https://wa.me/919898552297?text=${encodeURIComponent(`Hello, I would like to schedule a 40x Loupe live video consultation for ${product.name} (${sku}).`)}`}
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
                  Instant guidance on diamond certification, proportions, and insured delivery schedules.
                </p>
              </div>
              <a
                href={whatsappLink(`Hello ${site.name}, please assist me with ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#2F6B4F] font-semibold hover:underline flex items-center gap-1"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* PIN Code Delivery Checker */}
          <div className="bg-white p-4 border border-[var(--color-line)] shadow-xs flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] font-medium">
              Check delivery to your PIN code
            </span>
            <div className="flex gap-2">
              <div className={cn("flex-1 relative border", pinBorderClass)}>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-slate)]" />
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, ""));
                    setPinStatus("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePinCheck();
                  }}
                  placeholder="Enter 6-digit PIN code"
                  className="h-10 w-full pl-8 pr-3 font-mono text-xs text-[var(--color-ink)] bg-transparent outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handlePinCheck}
                disabled={pinStatus === "checking"}
                className="h-10 px-5 bg-[var(--color-ink)] text-white font-mono text-xs uppercase tracking-widest hover:bg-black transition-colors rounded-none"
              >
                {pinStatus === "checking" ? <Loader2 className="size-3.5 animate-spin" /> : "Check"}
              </button>
            </div>
            {pinMessage && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-slate)] pt-1">
                <Truck className="size-3.5 text-[#2F6B4F]" />
                <span>{pinMessage}</span>
              </div>
            )}
          </div>

          {/* 3 Trust Strip Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F6F4EF] p-2.5 border border-[var(--color-line)]">
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
                  Insured Regional Transit
                </span>
                <span className="text-[10px] text-[var(--color-slate)]">100% full transit coverage</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-1">
              <RotateCcw className="size-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase font-semibold text-[var(--color-ink)]">
                  30-Day Inspection Right
                </span>
                <span className="text-[10px] text-[var(--color-slate)]">With original laboratory report</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM TABBED SPECIFICATIONS & SCIENTIFIC DOSSIER */}
      <section className="w-full bg-white border border-[var(--color-line)] p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
        {/* Tab Header */}
        <div className="flex gap-6 overflow-x-auto select-none border-b border-[var(--color-line)] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "font-mono text-xs uppercase tracking-wider relative transition-colors",
              activeTab === "overview"
                ? "text-[var(--color-ink)] font-semibold"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Overview
            {activeTab === "overview" && (
              <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("grading")}
            className={cn(
              "font-mono text-xs uppercase tracking-wider relative transition-colors",
              activeTab === "grading"
                ? "text-[var(--color-ink)] font-semibold"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Grading Report
            {activeTab === "grading" && (
              <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certificate")}
            className={cn(
              "font-mono text-xs uppercase tracking-wider relative transition-colors",
              activeTab === "certificate"
                ? "text-[var(--color-ink)] font-semibold"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Certificate Dossier
            {activeTab === "certificate" && (
              <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={cn(
              "font-mono text-xs uppercase tracking-wider relative transition-colors",
              activeTab === "shipping"
                ? "text-[var(--color-ink)] font-semibold"
                : "text-[var(--color-slate)] hover:text-[var(--color-ink)]"
            )}
          >
            Shipping &amp; Transit
            {activeTab === "shipping" && (
              <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />
            )}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4 bg-[#F6F4EF] p-5 border border-[var(--color-line)]">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink)] font-semibold">
                  Proportions Blueprint
                </span>
                <span className="font-mono text-[11px] text-[var(--color-slate)]">L:W Ratio 1.42</span>
              </div>

              {/* Proportions SVG Diagram */}
              <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-white border border-[var(--color-line)] p-4">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 500 240">
                  <line stroke="#d9dee6" strokeDasharray="2 2" strokeWidth="1" x1="80" x2="420" y1="30" y2="30" />
                  <line stroke="#d9dee6" strokeDasharray="2 2" strokeWidth="1" x1="80" x2="420" y1="210" y2="210" />
                  <line stroke="#172033" strokeWidth="2" x1="160" x2="340" y1="40" y2="40" />
                  <line stroke="#172033" strokeWidth="1.8" x1="160" x2="80" y1="40" y2="105" />
                  <line stroke="#172033" strokeWidth="1.8" x1="340" x2="420" y1="40" y2="105" />
                  <rect fill="#F6F4EF" height="8" stroke="#172033" strokeWidth="1.5" width="340" x="80" y="105" />
                  <line stroke="#172033" strokeWidth="1.8" x1="80" x2="250" y1="113" y2="210" />
                  <line stroke="#172033" strokeWidth="1.8" x1="420" x2="250" y1="113" y2="210" />
                  <text fill="#172033" fontSize="11" fontWeight="600" textAnchor="middle" x="250" y="25">
                    Table: 62%
                  </text>
                  <text fill="#172033" fontSize="11" fontWeight="600" textAnchor="middle" transform="rotate(90 460 130)" x="460" y="130">
                    Depth: 63.1%
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white border border-[var(--color-line)]">
                  <span className="block font-mono text-[9px] uppercase text-[var(--color-slate)]">Length:Width</span>
                  <span className="font-serif text-[16px] text-[var(--color-ink)]">1.42</span>
                </div>
                <div className="p-2 bg-white border border-[var(--color-line)]">
                  <span className="block font-mono text-[9px] uppercase text-[var(--color-slate)]">Table Ratio</span>
                  <span className="font-serif text-[16px] text-[var(--color-ink)]">62.0%</span>
                </div>
                <div className="p-2 bg-white border border-[var(--color-line)]">
                  <span className="block font-mono text-[9px] uppercase text-[var(--color-slate)]">Total Depth</span>
                  <span className="font-serif text-[16px] text-[var(--color-ink)]">63.1%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Colour Scale */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] font-semibold">
                    Colour Scale Spectrum
                  </span>
                  <span className="font-mono text-xs text-[var(--color-slate)] font-medium">Stone Grade: F</span>
                </div>
                <div className="grid grid-cols-8 gap-1 pt-1">
                  {["D", "E", "F", "G", "H", "I", "J", "K"].map((c) => {
                    const isStone = c === "F";
                    return (
                      <div key={c} className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-full h-8 flex items-center justify-center font-mono text-xs",
                            isStone
                              ? "bg-[var(--canvas-dark,#0D0D0D)] text-white font-bold"
                              : "bg-[#F6F4EF] text-[var(--color-slate)]"
                          )}
                        >
                          {c}
                        </div>
                        <span className="text-[9px] font-mono text-[var(--color-muted)]">
                          {isStone ? "This stone" : c === "D" ? "Pure" : "Tint"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clarity Scale */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] font-semibold">
                    Clarity Scale Spectrum
                  </span>
                  <span className="font-mono text-xs text-[var(--color-slate)] font-medium">Stone Grade: VS1</span>
                </div>
                <div className="grid grid-cols-7 gap-1 pt-1">
                  {["FL/IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"].map((cl) => {
                    const isStone = cl === "VS1";
                    return (
                      <div key={cl} className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-full h-8 flex items-center justify-center font-mono text-[10px]",
                            isStone
                              ? "bg-[var(--canvas-dark,#0D0D0D)] text-white font-bold"
                              : "bg-[#F6F4EF] text-[var(--color-slate)]"
                          )}
                        >
                          {cl}
                        </div>
                        <span className="text-[9px] font-mono text-[var(--color-muted)]">
                          {isStone ? "This stone" : cl === "FL/IF" ? "Flawless" : "Eye clean"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Growth summary note */}
              <div className="bg-[#F6F4EF] p-4 text-xs text-[var(--color-slate)] leading-relaxed border border-[var(--color-line)]">
                <strong className="text-[var(--color-ink)] font-medium">Diamond Pedigree: </strong>
                {isLabGrown
                  ? "Created through Chemical Vapour Deposition (CVD), this Type IIa diamond exhibits 100% identical carbon lattice crystallization, optical brilliance, and hardness to mined diamonds."
                  : "Mined and precision cut in our Surat atelier under ethical Kimberley Process protocols with verifiable laboratory grading."}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Grading Report */}
        {activeTab === "grading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            <div className="flex flex-col divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
              <div className="flex justify-between p-3 bg-[#F6F4EF]">
                <span className="text-xs text-[var(--color-slate)]">Measurements</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">8.05 × 5.67 × 3.58 mm</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-xs text-[var(--color-slate)]">Polish</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">Excellent</span>
              </div>
              <div className="flex justify-between p-3 bg-[#F6F4EF]">
                <span className="text-xs text-[var(--color-slate)]">Symmetry</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">Excellent</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-xs text-[var(--color-slate)]">Fluorescence</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">None / Faint</span>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
              <div className="flex justify-between p-3 bg-[#F6F4EF]">
                <span className="text-xs text-[var(--color-slate)]">Girdle Thickness</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">Medium to Slightly Thick</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-xs text-[var(--color-slate)]">Culet</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">Pointed (None)</span>
              </div>
              <div className="flex justify-between p-3 bg-[#F6F4EF]">
                <span className="text-xs text-[var(--color-slate)]">Growth Process</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium">
                  {isLabGrown ? "CVD (Type IIa)" : "Natural Geological"}
                </span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-xs text-[var(--color-slate)]">Laser Inscription</span>
                <span className="font-mono text-xs text-[var(--color-ink)] font-medium text-[#2F6B4F]">
                  {sku}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Certificate Dossier */}
        {activeTab === "certificate" && (
          <div className="bg-white border border-[var(--color-line)] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-16 h-20 bg-[#F6F4EF] border border-[var(--color-line)] flex flex-col items-center justify-center p-2 shrink-0">
                <ShieldCheck className="size-8 text-[var(--color-ink)]" />
                <span className="font-mono text-[8px] text-[var(--color-slate)] mt-1">SEAL</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-[18px] text-[var(--color-ink)]">
                    Official Gemological Report
                  </span>
                  <span className="px-2 py-0.5 bg-[#F6F4EF] font-mono text-[11px] text-[var(--color-ink)] border border-[var(--color-line)]">
                    {sku}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-slate)]">
                  International laboratory report verifying the four Cs, authenticity, and optical performance.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-slate)] pt-1">
                  <span>Report ID: {sku}</span>
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="text-[var(--color-ink)] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <Copy className="size-3" />
                    {copied ? "Copied" : "Copy ID"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <a
                href={`https://www.igi.org/reports/verify-your-report?r=${sku}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white border border-[var(--color-line)] text-[var(--color-ink)] font-mono text-xs uppercase tracking-wider hover:border-[var(--color-ink)] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Verify on Registry</span>
                <ExternalLink className="size-3.5" />
              </a>
              <button
                type="button"
                onClick={() => showToast("Downloading official certificate dossier...", "info")}
                className="px-5 py-2.5 bg-[var(--canvas-dark,#0D0D0D)] text-white font-mono text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-1.5"
              >
                View Report PDF
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Shipping & Transit */}
        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F6F4EF] border border-[var(--color-line)] flex flex-col gap-2">
              <Truck className="size-6 text-[var(--color-ink)]" />
              <h4 className="font-serif text-[16px] text-[var(--color-ink)]">Insured Armored Transit</h4>
              <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                Handled by secured courier services with tamper-evident digital seal locks and transit coverage until personal handover.
              </p>
            </div>

            <div className="p-4 bg-[#F6F4EF] border border-[var(--color-line)] flex flex-col gap-2">
              <ShieldCheck className="size-6 text-[#2F6B4F]" />
              <h4 className="font-serif text-[16px] text-[var(--color-ink)]">Dual Optical Check</h4>
              <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                Every stone is re-inspected under optical spectrometers in our Surat atelier prior to sealing inside the archival safe box.
              </p>
            </div>

            <div className="p-4 bg-[#F6F4EF] border border-[var(--color-line)] flex flex-col gap-2">
              <RotateCcw className="size-6 text-[var(--color-ink)]" />
              <h4 className="font-serif text-[16px] text-[var(--color-ink)]">30-Day Inspection Right</h4>
              <p className="text-xs text-[var(--color-slate)] leading-relaxed">
                If the stone does not surpass your optical expectations, return in pristine laboratory condition within 30 days for a full refund.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
