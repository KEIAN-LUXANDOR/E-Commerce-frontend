"use client";

/**
 * order-summary.tsx
 *
 * Right-hand order summary panel shown throughout checkout and on the cart page.
 * Directly aligns with Mockup: mockups/secure_4_step_checkout_keian_luxandor/code.html
 *
 * Displays:
 *   - Live 15-Minute Reservation Countdown Widget with progress bar & amber warning
 *   - Specimen Stones list with LAB / NAT pill badge, cert number badge, shape, and price
 *   - Financial breakdown: Subtotal, Privilege Code (e.g. WELCOME10K), Insured Shipping (Complimentary),
 *     GST (3%) with CGST (1.5%) + SGST (1.5%), Grand Total
 *   - Zero nested ternaries in JSX
 */

import * as React from "react";
import { Tag, X, Check, Loader2, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import { DiamondArt } from "@/components/art/DiamondArt";
import type { CartLine } from "@/lib/stores";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** GST on polished diamonds & jewellery in India (3% total: 1.5% CGST + 1.5% SGST) */
const GST_RATE = 0.03;

/** Valid promo codes (mock) */
const MOCK_PROMOS: Record<string, { rate: number; label: string }> = {
  WELCOME10K: { rate: 0.05, label: "Concierge Welcome" },
  KEIAN10: { rate: 0.10, label: "Private Atelier Privilege" },
  VIP15: { rate: 0.15, label: "Collector Reserve" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calculateGst(subPaise: number): { cgst: number; sgst: number; totalGst: number } {
  const totalGst = Math.round(subPaise * GST_RATE);
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;
  return { cgst, sgst, totalGst };
}

// ---------------------------------------------------------------------------
// Sub-component: Reservation Countdown Widget
// ---------------------------------------------------------------------------

function ReservationTimerWidget() {
  const [totalSeconds, setTotalSeconds] = React.useState(14 * 60 + 12);
  const maxSeconds = 15 * 60;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const pct = Math.max(0, Math.min(100, (totalSeconds / maxSeconds) * 100));
  const isWarning = totalSeconds < 180; // under 3 minutes

  return (
    <div className="bg-white border border-[var(--color-line)] p-4 md:p-5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5 font-semibold">
          <Timer className="size-3.5 text-[var(--brand-anchor,#0A192F)]" />
          We&apos;re holding this diamond for you
        </span>
        <span
          className={cn(
            "font-mono font-semibold text-[12px] px-2 py-0.5 rounded-none border",
            isWarning
              ? "text-[#b45309] bg-[#fef3c7] border-[#fde68a]"
              : "text-[var(--color-ink)] bg-[#F1F5F9] border-[var(--color-line)]"
          )}
        >
          {formattedTime}
        </span>
      </div>
      <div className="w-full bg-[#E2EAF2] h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000",
            isWarning ? "bg-[#d97706]" : "bg-[var(--canvas-dark,#0A192F)]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Specimen Line Item
// ---------------------------------------------------------------------------

function SpecimenLineItem({ line }: { line: CartLine }) {
  const isLabGrown = line.slug.includes("lab-grown");
  const certAuthority = line.certificateNumber?.startsWith("LG") ? "IGI" : "GIA";

  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-[var(--color-line)]/70 last:border-b-0">
      {/* Thumbnail Well with LAB/NAT Badge */}
      <div className="size-16 bg-[#F1F5F9] border border-[var(--color-line)] flex-shrink-0 relative overflow-hidden flex items-center justify-center p-1.5">
        {line.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={line.imageUrl}
            alt={line.title}
            className="w-full h-full object-contain mix-blend-multiply opacity-90"
          />
        ) : (
          <div className="w-10 h-10 text-[var(--color-ink)]">
            <DiamondArt shape={line.shape || "ROUND"} title={line.title} className="w-full h-full" />
          </div>
        )}
        <span
          className={cn(
            "absolute bottom-0 right-0 font-mono text-[8px] px-1 py-0.2 tracking-wider font-semibold border",
            isLabGrown
              ? "bg-[var(--canvas-dark,#0A192F)] text-white border-transparent"
              : "bg-white text-[var(--color-ink)] border-[var(--color-line)]"
          )}
        >
          {isLabGrown ? "LAB" : "NAT"}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-serif text-[14px] font-normal text-[var(--color-ink)] truncate leading-tight">
            {line.title}
          </h4>
          <span className="font-mono text-[13px] text-[var(--color-ink)] whitespace-nowrap font-medium tabular-nums ml-2">
            {formatINR(line.pricePaise)}
          </span>
        </div>
        <p className="font-mono text-[10px] text-[var(--color-slate)] mt-0.5 truncate">
          {line.specLabel}
        </p>
        <div className="flex items-center gap-2 mt-1 font-mono text-[9px] text-[var(--color-slate)]">
          <span className="px-1.5 py-0.2 bg-[#F1F5F9] border border-[var(--color-line)]">
            {certAuthority} {line.certificateNumber || "INSCRIBED"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main OrderSummary Component
// ---------------------------------------------------------------------------

interface OrderSummaryProps {
  lines: CartLine[];
  showPromo?: boolean;
  onTotalChange?: (totalPaise: number) => void;
  className?: string;
  showTimer?: boolean;
}

export function OrderSummary({
  lines,
  showPromo = true,
  onTotalChange,
  className,
  showTimer = true,
}: OrderSummaryProps) {
  const [promoInput, setPromoInput] = React.useState("");
  const [promoStatus, setPromoStatus] = React.useState<"idle" | "checking" | "applied" | "invalid">("idle");
  const [promoRate, setPromoRate] = React.useState(0);
  const [appliedCode, setAppliedCode] = React.useState("");

  const subtotalPaise = lines.reduce((sum, l) => sum + l.pricePaise, 0);
  const discountPaise = promoStatus === "applied" ? Math.round(subtotalPaise * promoRate) : 0;
  const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const { cgst, sgst, totalGst } = calculateGst(discountedSubtotal);
  const grandTotalPaise = discountedSubtotal + totalGst;

  React.useEffect(() => {
    onTotalChange?.(grandTotalPaise);
  }, [grandTotalPaise, onTotalChange]);

  async function handleApplyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    setPromoStatus("checking");
    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    const promo = MOCK_PROMOS[code];
    if (promo) {
      setPromoRate(promo.rate);
      setAppliedCode(code);
      setPromoStatus("applied");
    } else {
      setPromoStatus("invalid");
    }
  }

  function handleRemovePromo() {
    setPromoRate(0);
    setAppliedCode("");
    setPromoInput("");
    setPromoStatus("idle");
  }

  return (
    <aside className={cn("space-y-4", className)} aria-label="Order summary">
      {/* 1. Reservation Countdown Widget */}
      {showTimer && lines.length > 0 && <ReservationTimerWidget />}

      {/* 2. Specimen Dossier & Financial Summary Card */}
      <div className="bg-white border border-[var(--color-line)] p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-line)]">
          <div>
            <h2 className="font-serif text-[18px] text-[var(--color-ink)] font-normal">
              Order Summary
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)] mt-0.5">
              {`${lines.length} ${lines.length === 1 ? "stone" : "stones"} reserved`}
            </p>
          </div>
          <span className="font-mono text-[10px] text-[var(--color-slate)] uppercase tracking-wider">
            Verified Dossier
          </span>
        </div>

        {/* Stone Items List */}
        <div className="divide-y divide-[var(--color-line)]/50 pb-2">
          {lines.length === 0 ? (
            <p className="py-4 text-center font-mono text-[11px] text-[var(--color-slate)]">
              Your cart is empty.
            </p>
          ) : (
            lines.map((line) => <SpecimenLineItem key={line.diamondId} line={line} />)
          )}
        </div>

        {/* Promo code field */}
        {showPromo && (
          <div className="py-3 border-t border-[var(--color-line)]/70">
            {promoStatus === "applied" ? (
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#F1F5F9] border border-[var(--color-line)] text-[11px] font-mono">
                <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-700" />
                  Privilege Code: {appliedCode} (−{formatINR(discountPaise)})
                </span>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-[var(--color-slate)] hover:text-red-700"
                  title="Remove privilege code"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    setPromoStatus("idle");
                  }}
                  placeholder="Privilege code"
                  className="h-9 px-3 w-full font-mono text-[11px] text-[var(--color-ink)] bg-[#F1F5F9] border border-[var(--color-line)] uppercase outline-none focus:border-[var(--color-ink)]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoStatus === "checking" || !promoInput.trim()}
                  className="h-9 px-4 bg-[var(--color-ink)] text-white font-mono text-[11px] uppercase tracking-wider hover:bg-black transition-colors shrink-0 disabled:opacity-50"
                >
                  {promoStatus === "checking" ? <Loader2 className="size-3 animate-spin" /> : "Apply"}
                </button>
              </div>
            )}
            {promoStatus === "invalid" && (
              <p className="mt-1 font-mono text-[10px] text-red-600">
                Invalid or expired privilege code.
              </p>
            )}
          </div>
        )}

        {/* Financial Breakdown Table */}
        <div className="py-3 border-t border-[var(--color-line)]/70 space-y-2 text-[12px] font-mono">
          <div className="flex items-center justify-between text-[var(--color-slate)]">
            <span>Subtotal</span>
            <span className="text-[var(--color-ink)] tabular-nums font-medium">
              {formatINR(subtotalPaise)}
            </span>
          </div>

          {discountPaise > 0 && (
            <div className="flex items-center justify-between text-emerald-800">
              <span className="flex items-center gap-1">
                <Tag className="size-3" />
                Privilege Deduction
              </span>
              <span className="tabular-nums font-medium">−{formatINR(discountPaise)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[var(--color-slate)]">
            <span>Insured Transit</span>
            <span className="text-emerald-800 uppercase tracking-wider font-semibold">Complimentary</span>
          </div>

          <div className="pt-2 border-t border-[var(--color-line)]/50 flex flex-col gap-1 text-[11px] text-[var(--color-slate)]">
            <div className="flex items-center justify-between">
              <span>GST (3%)</span>
              <span className="text-[var(--color-ink)] tabular-nums">{formatINR(totalGst)}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--color-slate)] pl-2">
              <span>CGST (1.5%) + SGST (1.5%)</span>
              <span>{formatINR(cgst)} + {formatINR(sgst)}</span>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t-2 border-[var(--color-ink)] flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink)] font-semibold block">
              Total
            </span>
            <span className="font-mono text-[10px] text-[var(--color-slate)]">All taxes included</span>
          </div>
          <div className="text-right">
            <span className="font-serif text-[24px] text-[var(--color-ink)] font-normal tracking-tight tabular-nums">
              {formatINR(grandTotalPaise)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
