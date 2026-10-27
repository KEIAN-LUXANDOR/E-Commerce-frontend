"use client";

/**
 * address-selector.tsx
 *
 * Step 2 of checkout: Insured Delivery Address.
 *
 * Shows saved addresses (loaded from backend) and allows the customer to:
 *   - Select an existing saved address.
 *   - Add a new address via an inline form.
 *
 * The form fields match the API contract:
 *   POST /api/v1/addresses → DeliveryAddressRequest
 *
 * Design contract:
 *   - 48px tactile input heights, hairline borders.
 *   - Selected address highlighted with --color-ink border.
 *   - No nested ternaries.
 */

import * as React from "react";
import { Plus, MapPin, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

// ---------------------------------------------------------------------------
// Indian states list
// ---------------------------------------------------------------------------

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry", "Jammu and Kashmir",
  "Ladakh",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AddressSelectorProps {
  savedAddresses: DeliveryAddress[];
  selectedId: string | null;
  onSelect: (address: DeliveryAddress) => void;
  onNewAddress: (req: DeliveryAddressRequest) => Promise<DeliveryAddress>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-component: Saved Address Card
// ---------------------------------------------------------------------------

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: DeliveryAddress;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 border transition-colors",
        selected
          ? "border-[var(--color-ink)] bg-white"
          : "border-[var(--color-line)] bg-white hover:border-[var(--color-slate)]"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <MapPin
            className={cn(
              "size-4 flex-shrink-0 mt-0.5",
              selected ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"
            )}
            aria-hidden="true"
          />
          <div>
            <p className="font-sans text-[13px] font-medium text-[var(--color-ink)]">
              {address.fullName}
            </p>
            <p className="font-mono text-[11px] text-[var(--color-slate)] mt-0.5 leading-relaxed">
              {address.line1}
              {address.line2 && `, ${address.line2}`}
              {address.landmark && ` (near ${address.landmark})`}
              <br />
              {address.city}, {address.state} – {address.pincode}
            </p>
            <p className="font-mono text-[10px] text-[var(--color-muted)] mt-1">
              {address.phone}
            </p>
          </div>
        </div>

        {selected && (
          <div className="grid size-5 place-items-center bg-[var(--color-ink)] flex-shrink-0">
            <Check className="size-3 text-white" aria-hidden="true" />
          </div>
        )}
      </div>

      {address.defaultAddress && (
        <div className="mt-2 ml-7">
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--color-slate)] border border-[var(--color-line)] px-1.5 py-0.5">
            Default
          </span>
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Labelled Input Field
// ---------------------------------------------------------------------------

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement>>;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-slate)]"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[10px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: New Address Form
// ---------------------------------------------------------------------------

interface NewAddressFormProps {
  onSubmit: (req: DeliveryAddressRequest) => Promise<void>;
  onCancel: () => void;
}

function NewAddressForm({ onSubmit, onCancel }: NewAddressFormProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof DeliveryAddressRequest, string>>>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<DeliveryAddressRequest>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  function updateField(key: keyof DeliveryAddressRequest, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^\+?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.line1.trim()) next.line1 = "Address line 1 is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.state) next.state = "Please select a state.";
    if (!/^[1-9]\d{5}$/.test(form.pincode)) next.pincode = "Enter a valid 6-digit PIN code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(form);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save this address.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "h-12 w-full border border-[var(--color-line)] bg-white px-3 font-mono text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-ink)] transition-colors";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 p-4 border border-[var(--color-line)] bg-white">
      <p className="font-serif text-base text-[var(--color-ink)]">New Delivery Address</p>
      {submitError && <p role="alert" className="text-sm text-red-600">{submitError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="fullName" label="Full Name" required error={errors.fullName}>
          <input
            id="fullName"
            type="text"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="As on Aadhaar / ID"
            className={cn(inputClass, errors.fullName && "border-red-400")}
            autoComplete="name"
          />
        </Field>

        <Field id="phone" label="Mobile Number" required error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className={cn(inputClass, errors.phone && "border-red-400")}
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field id="line1" label="Address Line 1" required error={errors.line1}>
        <input
          id="line1"
          type="text"
          value={form.line1}
          onChange={(e) => updateField("line1", e.target.value)}
          placeholder="Flat, House no., Building"
          className={cn(inputClass, errors.line1 && "border-red-400")}
          autoComplete="address-line1"
        />
      </Field>

      <Field id="line2" label="Address Line 2">
        <input
          id="line2"
          type="text"
          value={form.line2 ?? ""}
          onChange={(e) => updateField("line2", e.target.value)}
          placeholder="Area, Colony (optional)"
          className={inputClass}
          autoComplete="address-line2"
        />
      </Field>

      <Field id="landmark" label="Landmark">
        <input
          id="landmark"
          type="text"
          value={form.landmark ?? ""}
          onChange={(e) => updateField("landmark", e.target.value)}
          placeholder="Near landmark (optional)"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="city" label="City" required error={errors.city}>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Mumbai"
            className={cn(inputClass, errors.city && "border-red-400")}
            autoComplete="address-level2"
          />
        </Field>

        <Field id="state" label="State" required error={errors.state}>
          <select
            id="state"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            className={cn(
              "h-12 w-full border bg-white px-3 font-mono text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)] transition-colors",
              errors.state ? "border-red-400" : "border-[var(--color-line)]"
            )}
            autoComplete="address-level1"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field id="pincode" label="PIN Code" required error={errors.pincode}>
          <input
            id="pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={form.pincode}
            onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
            placeholder="400001"
            className={cn(inputClass, errors.pincode && "border-red-400")}
            autoComplete="postal-code"
          />
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2",
            "bg-[var(--color-ink)] text-white font-mono text-[11px] uppercase tracking-[0.1em]",
            "hover:bg-[var(--color-slate)] transition-colors disabled:opacity-60"
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Address"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "flex h-12 items-center justify-center px-5",
            "border border-[var(--color-line)] text-[var(--color-ink)]",
            "font-mono text-[11px] uppercase tracking-[0.08em]",
            "hover:border-[var(--color-ink)] transition-colors"
          )}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function AddressSelector({
  savedAddresses,
  selectedId,
  onSelect,
  onNewAddress,
  className,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = React.useState(savedAddresses.length === 0);

  async function handleNewAddress(req: DeliveryAddressRequest) {
    const saved = await onNewAddress(req);
    onSelect(saved);
    setShowForm(false);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Saved addresses */}
      {savedAddresses.length > 0 && (
        <div className="flex flex-col gap-2">
          {savedAddresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selected={addr.id === selectedId}
              onSelect={() => onSelect(addr)}
            />
          ))}
        </div>
      )}

      {/* New address form / toggle */}
      {showForm ? (
        <NewAddressForm
          onSubmit={handleNewAddress}
          onCancel={() => savedAddresses.length > 0 && setShowForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 border border-dashed border-[var(--color-line)]",
            "font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-slate)]",
            "hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
          )}
        >
          <Plus className="size-4" />
          Add New Address
        </button>
      )}
    </div>
  );
}
