"use client";

import { useEffect, useState } from "react";
import { FormAlert, TextField } from "@/components/auth/FormParts";
import { createDeliveryAddress, getIndianStates, updateDeliveryAddress } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

const EMPTY: DeliveryAddressRequest = { fullName: "", phone: "", line1: "", line2: "", landmark: "", city: "", state: "", pincode: "" };

function valuesFrom(address?: DeliveryAddress): DeliveryAddressRequest {
  if (!address) return EMPTY;
  return {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 ?? "",
    landmark: address.landmark ?? "",
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };
}

let statesCache: Promise<string[]> | null = null;
function loadStates() {
  statesCache ??= getIndianStates();
  statesCache.catch(() => (statesCache = null));
  return statesCache;
}

/**
 * Add or edit a delivery address (POST / PUT /account/addresses).
 * Used on My addresses and at checkout. The backend checks every field and its messages are shown under each one.
 */
export function AddressForm({
  address,
  defaultName,
  defaultPhone,
  onSaved,
  onCancel,
  heading,
  makeDefaultOption = true,
}: {
  /** Address being edited; leave out to add a new one */
  address?: DeliveryAddress;
  defaultName?: string;
  defaultPhone?: string | null;
  onSaved: (saved: DeliveryAddress) => void;
  onCancel?: () => void;
  heading?: string;
  makeDefaultOption?: boolean;
}) {
  const [values, setValues] = useState<DeliveryAddressRequest>(() => {
    const start = valuesFrom(address);
    if (!address && defaultName) start.fullName = defaultName;
    if (!address && defaultPhone) start.phone = defaultPhone;
    return start;
  });
  const [makeDefault, setMakeDefault] = useState(Boolean(address?.defaultAddress));
  const [states, setStates] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    loadStates()
      .then((list) => {
        if (active) setStates(list);
      })
      .catch(() => {
        if (active) setError("Couldn’t load the list of states. Please refresh the page.");
      });
    return () => {
      active = false;
    };
  }, []);

  function change(field: keyof DeliveryAddressRequest, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    setFieldErrors({});
    const body: DeliveryAddressRequest = {
      fullName: values.fullName.trim(),
      phone: values.phone.replace(/\D/g, "").slice(-10),
      line1: values.line1.trim(),
      ...(values.line2?.trim() ? { line2: values.line2.trim() } : {}),
      ...(values.landmark?.trim() ? { landmark: values.landmark.trim() } : {}),
      city: values.city.trim(),
      state: values.state,
      pincode: values.pincode.trim(),
      ...(makeDefault ? { makeDefault: true } : {}),
    };
    try {
      let saved: DeliveryAddress;
      if (address) saved = await updateDeliveryAddress(address.id, body);
      else saved = await createDeliveryAddress(body);
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
      setError(err instanceof Error ? err.message : "Couldn’t save this address. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  let submitLabel = "Save address";
  if (address) submitLabel = "Save changes";
  if (busy) submitLabel = "Saving…";

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {heading && <h3 className="font-serif text-2xl">{heading}</h3>}
      {error && <FormAlert>{error}</FormAlert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" maxLength={100} value={values.fullName} onChange={(e) => change("fullName", e.target.value)} error={fieldErrors.fullName} />
        <TextField label="Mobile number" hint="For the courier to call on delivery" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={14} value={values.phone} onChange={(e) => change("phone", e.target.value)} error={fieldErrors.phone} />
      </div>
      <TextField label="Flat / house number, building, street" autoComplete="address-line1" maxLength={200} value={values.line1} onChange={(e) => change("line1", e.target.value)} error={fieldErrors.line1} />
      <TextField label="Area, locality" autoComplete="address-line2" maxLength={200} value={values.line2 ?? ""} onChange={(e) => change("line2", e.target.value)} error={fieldErrors.line2} optional />
      <TextField label="Landmark" maxLength={100} value={values.landmark ?? ""} onChange={(e) => change("landmark", e.target.value)} error={fieldErrors.landmark} optional />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="City" autoComplete="address-level2" maxLength={80} value={values.city} onChange={(e) => change("city", e.target.value)} error={fieldErrors.city} />
        <TextField label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} value={values.pincode} onChange={(e) => change("pincode", e.target.value.replace(/\D/g, ""))} error={fieldErrors.pincode} />
        <div>
          <label htmlFor="address-state" className="block text-sm font-medium">
            State
          </label>
          <select
            id="address-state"
            className={`field mt-1.5 ${fieldErrors.state ? "border-out" : ""}`}
            value={values.state}
            onChange={(e) => change("state", e.target.value)}
            aria-invalid={!!fieldErrors.state}
            aria-describedby={fieldErrors.state ? "address-state-error" : undefined}
          >
            <option value="">Choose…</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {fieldErrors.state && (
            <p id="address-state-error" className="mt-1.5 text-sm text-out">
              {fieldErrors.state}
            </p>
          )}
        </div>
      </div>
      {makeDefaultOption && (
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-ink" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />
          Use this as my default address
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
