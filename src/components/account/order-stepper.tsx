"use client";

/**
 * Order Transit Milestone Stepper
 *
 * Displays the 6-stage physical custody & security chain for diamond orders:
 *   1. Order Confirmed (Funds locked in escrow)
 *   2. Loupe & Metrology Inspection (Gemologist verification)
 *   3. Tamper-Evident Security Seal (Barcoded serialized pouch)
 *   4. Armed Escort Transit (Sequel / Malca-Amit armoured logistics)
 *   5. Out for Delivery (Biometric / OTP handoff)
 *   6. Signed & Vault Delivered (Proof of delivery confirmed)
 *
 * Human-Centric Rules:
 *   - Zero nested ternaries.
 *   - Semantic SVG milestones with clear visual contrast.
 */

import * as React from "react";
import { Check, ShieldCheck, Box, Truck, UserCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type TransitMilestoneKey =
  | "CONFIRMED"
  | "INSPECTED"
  | "SEALED"
  | "ARMED_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface TransitMilestone {
  key: TransitMilestoneKey;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TRANSIT_MILESTONES: TransitMilestone[] = [
  {
    key: "CONFIRMED",
    label: "Order Confirmed",
    sublabel: "Funds secured in escrow",
    icon: Shield,
  },
  {
    key: "INSPECTED",
    label: "Forensic Inspection",
    sublabel: "10x Loupe & Cert verified",
    icon: ShieldCheck,
  },
  {
    key: "SEALED",
    label: "Tamper Sealed",
    sublabel: "Numbered security pouch",
    icon: Box,
  },
  {
    key: "ARMED_TRANSIT",
    label: "Armoured Transit",
    sublabel: "Insured Sequel / Malca-Amit",
    icon: Truck,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Courier Escort",
    sublabel: "OTP verification required",
    icon: UserCheck,
  },
  {
    key: "DELIVERED",
    label: "Signed & Delivered",
    sublabel: "Customer vault handover",
    icon: Check,
  },
];

interface OrderStepperProps {
  currentStage: TransitMilestoneKey;
  className?: string;
}

export function OrderStepper({ currentStage, className }: OrderStepperProps) {
  const currentIndex = TRANSIT_MILESTONES.findIndex((m) => m.key === currentStage);
  const activeIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className={cn("w-full py-6", className)} aria-label="Order transit progress">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden lg:grid grid-cols-6 relative gap-2">
        {/* Progress line behind icons */}
        <div
          className="absolute top-5 left-8 right-8 h-[2px] bg-[var(--color-line)] -z-0"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[var(--color-ink)] transition-all duration-500"
            style={{
              width: `${(activeIdx / (TRANSIT_MILESTONES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {TRANSIT_MILESTONES.map((step, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const StepIcon = step.icon;

          let circleClass = "border-[var(--color-line)] bg-white text-[var(--color-muted)]";
          if (isDone) {
            circleClass = "border-[var(--color-ink)] bg-[var(--color-ink)] text-white";
          } else if (isCurrent) {
            circleClass = "border-[var(--color-ink)] bg-white text-[var(--color-ink)] ring-4 ring-[var(--color-stone)]";
          }

          let textClass = "text-[var(--color-muted)]";
          if (isDone || isCurrent) {
            textClass = "text-[var(--color-ink)] font-medium";
          }

          return (
            <div key={step.key} className="flex flex-col items-center text-center z-10 px-1">
              <div
                className={cn(
                  "size-10 rounded-full border-2 flex items-center justify-center transition-colors",
                  circleClass
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  <StepIcon className="size-4" />
                )}
              </div>
              <p className={cn("font-sans text-[11px] tracking-tight mt-3", textClass)}>
                {step.label}
              </p>
              <p className="font-mono text-[9px] text-[var(--color-slate)] mt-0.5 leading-tight">
                {step.sublabel}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile & Tablet Vertical Stepper */}
      <div className="lg:hidden space-y-4 relative pl-8">
        <div
          className="absolute top-4 bottom-4 left-3.5 w-[2px] bg-[var(--color-line)]"
          aria-hidden="true"
        />

        {TRANSIT_MILESTONES.map((step, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const StepIcon = step.icon;

          let badgeClass = "border-[var(--color-line)] bg-white text-[var(--color-muted)]";
          if (isDone) {
            badgeClass = "border-[var(--color-ink)] bg-[var(--color-ink)] text-white";
          } else if (isCurrent) {
            badgeClass = "border-[var(--color-ink)] bg-white text-[var(--color-ink)] ring-2 ring-[var(--color-stone)]";
          }

          let labelClass = "text-[var(--color-muted)]";
          if (isDone || isCurrent) {
            labelClass = "text-[var(--color-ink)] font-medium";
          }

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              <div
                className={cn(
                  "absolute -left-8 size-7 rounded-full border flex items-center justify-center bg-white",
                  badgeClass
                )}
              >
                {isDone ? <Check className="size-3" strokeWidth={3} /> : <StepIcon className="size-3" />}
              </div>
              <div>
                <p className={cn("font-sans text-xs", labelClass)}>{step.label}</p>
                <p className="font-mono text-[10px] text-[var(--color-slate)] mt-0.5">
                  {step.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
