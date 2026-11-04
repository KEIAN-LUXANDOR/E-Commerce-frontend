"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Loader2, MapPin } from "lucide-react";
import { MARKET_GROUPS, getMarketCountry } from "@/lib/market/countries";
import {
  getCallingCode,
  getPostalCodeLabel,
  getPostalCodePlaceholder,
  normalisePhoneForCountry,
  validatePhoneForCountry,
  validatePostalCode,
} from "@/lib/market/address-validation";
import type { DeliveryAddressRequest } from "@/lib/types/address";
import { cn } from "@/lib/utils";

interface AddressEntryFormProps {
  initialAddress?: Partial<DeliveryAddressRequest>;
  defaultCountryCode?: string;
  onSubmit: (address: DeliveryAddressRequest) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

type AddressFieldErrors = Partial<Record<keyof DeliveryAddressRequest, string>>;

const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink placeholder:text-slate/60 outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 disabled:opacity-60";
const LABEL_CLASS = "mb-1.5 block text-xs font-semibold tracking-wide text-ink";

export function AddressEntryForm({
  initialAddress,
  defaultCountryCode = "IN",
  onSubmit,
  onCancel,
  submitLabel = "Save address",
}: AddressEntryFormProps) {
  const initialCountryCode = (initialAddress?.countryCode || defaultCountryCode).toUpperCase();
  const [form, setForm] = useState<DeliveryAddressRequest>({
    fullName: initialAddress?.fullName ?? "",
    phone: initialAddress?.phone ?? "",
    line1: initialAddress?.line1 ?? "",
    line2: initialAddress?.line2 ?? "",
    landmark: initialAddress?.landmark ?? "",
    city: initialAddress?.city ?? "",
    state: initialAddress?.state ?? "",
    pincode: initialAddress?.pincode ?? "",
    countryCode: initialCountryCode,
    type: initialAddress?.type ?? "HOME",
    makeDefault: initialAddress?.makeDefault ?? false,
  });
  const [errors, setErrors] = useState<AddressFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");

  const countryCode = form.countryCode || defaultCountryCode;
  const country = getMarketCountry(countryCode);
  const countryOptions = useMemo(() => {
    const query = countryFilter.trim().toLowerCase();
    return MARKET_GROUPS.map((group) => ({
      label: group.label,
      countries: group.countries.filter((item) => !query || item.name.toLowerCase().includes(query) || item.code.toLowerCase() === query),
    })).filter((group) => group.countries.length > 0);
  }, [countryFilter]);

  function update<K extends keyof DeliveryAddressRequest>(field: K, value: DeliveryAddressRequest[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const next: AddressFieldErrors = {};
    if (!form.fullName.trim()) next.fullName = "Enter the recipient's full name.";
    const phoneError = validatePhoneForCountry(form.phone, countryCode);
    if (phoneError) next.phone = phoneError;
    if (!form.line1.trim()) next.line1 = "Enter the street address.";
    if (!form.city.trim()) next.city = "Enter the city or locality.";
    if (!form.state.trim()) next.state = "Enter the state, province or region.";
    const postalError = validatePostalCode(form.pincode, countryCode);
    if (postalError) next.pincode = postalError;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        ...form,
        fullName: form.fullName.trim(),
        phone: normalisePhoneForCountry(form.phone, countryCode),
        line1: form.line1.trim(),
        line2: form.line2?.trim() || "",
        landmark: form.landmark?.trim() || "",
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim().toUpperCase(),
        countryCode,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't save this address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-stone/60 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-accent-muted text-ink">
            <MapPin className="size-4" />
          </span>
          <div>
            <p className="font-serif text-lg text-ink">Delivery details</p>
            <p className="text-xs text-slate">Enter the address exactly as it should appear on the shipment.</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate sm:inline-flex">
          {country.name}
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {submitError && <p role="alert" className="rounded-xl border border-out/25 bg-out-bg px-4 py-3 text-sm text-out">{submitError}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="address-full-name" className={LABEL_CLASS}>Full name *</label>
            <input id="address-full-name" autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} className={cn(INPUT_CLASS, errors.fullName && "border-out")} placeholder="Recipient's full name" />
            {errors.fullName && <p role="alert" className="mt-1 text-xs text-out">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="address-phone" className={LABEL_CLASS}>Telephone *</label>
            <input id="address-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={cn(INPUT_CLASS, errors.phone && "border-out")} placeholder={`+${getCallingCode(countryCode)} …`} />
            <p className="mt-1 text-[11px] text-slate">Enter a local number or a full international number. The selected country&apos;s calling code is added when needed.</p>
            {errors.phone && <p role="alert" className="mt-1 text-xs text-out">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address-country" className={LABEL_CLASS}>Delivery country *</label>
          <input id="address-country-search" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className={cn(INPUT_CLASS, "mb-2")} placeholder="Search country…" aria-label="Search delivery countries" />
          <select
            id="address-country"
            aria-label="Delivery country"
            value={countryCode}
            onChange={(event) => {
              update("countryCode", event.target.value);
              setCountryFilter("");
              setErrors((current) => ({ ...current, pincode: undefined, phone: undefined }));
            }}
            className={INPUT_CLASS}
            autoComplete="country"
          >
            {countryOptions.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.countries.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
              </optgroup>
            ))}
            {!countryOptions.some((group) => group.countries.some((item) => item.code === countryCode)) && (
              <option value={countryCode}>{country.name}</option>
            )}
          </select>
        </div>

        <div className="border-t border-line pt-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-accent">Street address</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="address-line1" className={LABEL_CLASS}>Address line 1 *</label>
              <input id="address-line1" autoComplete="address-line1" value={form.line1} onChange={(event) => update("line1", event.target.value)} className={cn(INPUT_CLASS, errors.line1 && "border-out")} placeholder="Street, building and house number" />
              {errors.line1 && <p role="alert" className="mt-1 text-xs text-out">{errors.line1}</p>}
            </div>
            <div>
              <label htmlFor="address-line2" className={LABEL_CLASS}>Address line 2 <span className="font-normal text-slate">(optional)</span></label>
              <input id="address-line2" autoComplete="address-line2" value={form.line2 ?? ""} onChange={(event) => update("line2", event.target.value)} className={INPUT_CLASS} placeholder="Apartment, suite, unit, floor" />
            </div>
            {countryCode === "IN" && (
              <div>
                <label htmlFor="address-landmark" className={LABEL_CLASS}>Landmark <span className="font-normal text-slate">(optional)</span></label>
                <input id="address-landmark" value={form.landmark ?? ""} onChange={(event) => update("landmark", event.target.value)} className={INPUT_CLASS} placeholder="Nearby landmark" />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="address-city" className={LABEL_CLASS}>City / locality *</label>
            <input id="address-city" autoComplete="address-level2" value={form.city} onChange={(event) => update("city", event.target.value)} className={cn(INPUT_CLASS, errors.city && "border-out")} placeholder="City" />
            {errors.city && <p role="alert" className="mt-1 text-xs text-out">{errors.city}</p>}
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="address-region" className={LABEL_CLASS}>State / province *</label>
            <input id="address-region" autoComplete="address-level1" value={form.state} onChange={(event) => update("state", event.target.value)} className={cn(INPUT_CLASS, errors.state && "border-out")} placeholder="State or region" />
            {errors.state && <p role="alert" className="mt-1 text-xs text-out">{errors.state}</p>}
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="address-postal" className={LABEL_CLASS}>{getPostalCodeLabel(countryCode)} *</label>
            <input id="address-postal" autoComplete="postal-code" value={form.pincode} onChange={(event) => update("pincode", event.target.value.toUpperCase())} className={cn(INPUT_CLASS, errors.pincode && "border-out")} placeholder={getPostalCodePlaceholder(countryCode)} />
            {errors.pincode && <p role="alert" className="mt-1 text-xs text-out">{errors.pincode}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
          <label className="flex items-center gap-2 text-sm text-slate">
            <input type="checkbox" checked={Boolean(form.makeDefault)} onChange={(event) => update("makeDefault", event.target.checked)} className="size-4 rounded border-line accent-[var(--brand-accent)]" />
            Make this my default address
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} disabled={submitting} className="h-11 rounded-full border border-line px-5 text-xs font-semibold text-ink transition-colors hover:border-ink disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={submitting} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-anchor disabled:opacity-60">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
