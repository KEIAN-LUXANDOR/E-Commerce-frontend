"use client";

/**
 * checkout-stepper.tsx
 *
 * Linear 4-step progress indicator for the checkout flow.
 *
 * Steps:
 *   1. Contact & ID (email or guest)
 *   2. Delivery Address (insured transit destination)
 *   3. Review Order (stock reservation confirmation)
 *   4. Payment (Razorpay bridge)
 *
 * Design contract:
 *   - 1px hairline connector lines, no rounded corners.
 *   - Active step uses --color-ink fill; completed steps show a check mark.
 *   - Future steps are muted with --color-line border.
 *   - No nested ternaries.
 */

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckoutStep {
  id: number;
  label: string;
  description: string;
}

interface CheckoutStepperProps {
  steps: CheckoutStep[];
  currentStep: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Step status helpers (expanded, no nested ternaries)
// ---------------------------------------------------------------------------

type StepStatus = "complete" | "active" | "upcoming";

function stepStatus(stepId: number, currentStep: number): StepStatus {
  if (stepId < currentStep) return "complete";
  if (stepId === currentStep) return "active";
  return "upcoming";
}

// ---------------------------------------------------------------------------
// Sub-component: Step Circle
// ---------------------------------------------------------------------------

interface StepCircleProps {
  status: StepStatus;
  stepNumber: number;
}

function StepCircle({ status, stepNumber }: StepCircleProps) {
  if (status === "complete") {
    return (
      <div className="grid size-8 place-items-center bg-[var(--color-ink)]">
        <Check className="size-4 text-white" aria-hidden="true" />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="grid size-8 place-items-center bg-[var(--color-ink)]">
        <span className="font-mono text-[11px] font-medium text-white">{stepNumber}</span>
      </div>
    );
  }

  // upcoming
  return (
    <div className="grid size-8 place-items-center border border-[var(--color-line)] bg-white">
      <span className="font-mono text-[11px] text-[var(--color-muted)]">{stepNumber}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function CheckoutStepper({ steps, currentStep, className }: CheckoutStepperProps) {
  return (
    <nav
      aria-label="Checkout progress"
      className={cn("flex items-start", className)}
    >
      {steps.map((step, idx) => {
        const status = stepStatus(step.id, currentStep);
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="flex flex-col items-center flex-shrink-0">
              <StepCircle status={status} stepNumber={step.id} />

              {/* Label (hidden on small screens) */}
              <div className="mt-2 hidden sm:flex flex-col items-center text-center w-24">
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-[0.1em] leading-tight",
                    status === "upcoming"
                      ? "text-[var(--color-muted)]"
                      : "text-[var(--color-ink)]"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-px mt-4 mx-2",
                  status === "complete"
                    ? "bg-[var(--color-ink)]"
                    : "bg-[var(--color-line)]"
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Default step definitions (reused by the checkout page)
// ---------------------------------------------------------------------------

export const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 1, label: "Contact", description: "Your email & identity" },
  { id: 2, label: "Address", description: "Insured delivery address" },
  { id: 3, label: "Review", description: "Confirm your order" },
  { id: 4, label: "Payment", description: "Secure payment" },
];
