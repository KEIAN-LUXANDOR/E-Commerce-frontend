"use client";

import { useEffect, useState } from "react";
import { FormAlert, TextField } from "@/components/auth/FormParts";
import {
  createDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddresses,
  getIndianStates,
  setDefaultDeliveryAddress,
  updateDeliveryAddress,
} from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

type AddressValues = DeliveryAddressRequest;

const EMPTY_ADDRESS: AddressValues = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};

function toAddressValues(address: DeliveryAddress): AddressValues {
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

function messageFor(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const [editingId, setEditingId] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<AddressValues>(EMPTY_ADDRESS);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getDeliveryAddresses(), getIndianStates()])
      .then(([savedAddresses, indianStates]) => {
        if (!active) return;
        setAddresses(savedAddresses);
        setStates(indianStates);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(messageFor(error, "Couldn’t load your addresses. Please try again."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function startNewAddress() {
    setEditingId(undefined);
    setValues(EMPTY_ADDRESS);
    setFieldErrors({});
    setActionError(undefined);
    setShowForm(true);
  }

  function startEditing(address: DeliveryAddress) {
    setEditingId(address.id);
    setValues(toAddressValues(address));
    setFieldErrors({});
    setActionError(undefined);
    setShowForm(true);
  }

  function changeValue(field: keyof AddressValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError(undefined);
    setFieldErrors({});
    setBusy(true);

    const body: DeliveryAddressRequest = {
      fullName: values.fullName.trim(),
      phone: values.phone.replace(/\D/g, ""),
      line1: values.line1.trim(),
      ...(values.line2?.trim() ? { line2: values.line2.trim() } : {}),
      ...(values.landmark?.trim() ? { landmark: values.landmark.trim() } : {}),
      city: values.city.trim(),
      state: values.state,
      pincode: values.pincode.trim(),
    };

    try {
      if (editingId) {
        const saved = await updateDeliveryAddress(editingId, body);
        setAddresses((current) => current.map((address) => address.id === saved.id ? saved : address));
      } else {
        const saved = await createDeliveryAddress(body);
        setAddresses((current) => [saved, ...current]
          .sort((a, b) => Number(b.defaultAddress) - Number(a.defaultAddress)));
      }
      setShowForm(false);
      setEditingId(undefined);
      setValues(EMPTY_ADDRESS);
    } catch (error) {
      if (error instanceof ApiError) setFieldErrors(error.fieldErrors);
      setActionError(messageFor(error, "Couldn’t save this address. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function makeDefault(id: string) {
    setActionError(undefined);
    setBusy(true);
    try {
      const saved = await setDefaultDeliveryAddress(id);
      setAddresses((current) => current.map((address) => (
        address.id === saved.id ? saved : { ...address, defaultAddress: false }
      )));
    } catch (error) {
      setActionError(messageFor(error, "Couldn’t change your default address. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function removeAddress(address: DeliveryAddress) {
    if (!window.confirm(`Delete the address for ${address.fullName}?`)) return;
    setActionError(undefined);
    setBusy(true);
    try {
      await deleteDeliveryAddress(address.id);
      setAddresses((current) => {
        const remaining = current.filter((item) => item.id !== address.id);
        if (address.defaultAddress && remaining[0]) {
          remaining[0] = { ...remaining[0], defaultAddress: true };
        }
        return remaining;
      });
    } catch (error) {
      setActionError(messageFor(error, "Couldn’t delete this address. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section aria-labelledby="addresses-heading" className="space-y-4">
        <h2 id="addresses-heading" className="text-2xl">Delivery addresses</h2>
        <div aria-busy="true" className="skeleton h-32 rounded" />
      </section>
    );
  }

  return (
    <section aria-labelledby="addresses-heading" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="addresses-heading" className="font-serif text-2xl font-normal">Saved addresses</h2>
          <p className="mt-1 text-sm text-slate">Choose where you’d like your order delivered.</p>
        </div>
        {!showForm && (
          <button type="button" onClick={startNewAddress} className="btn btn-secondary">
            Add address
          </button>
        )}
      </div>

      {loadError && <FormAlert>{loadError}</FormAlert>}
      {actionError && <FormAlert>{actionError}</FormAlert>}

      {showForm && (
        <form onSubmit={saveAddress} className="space-y-5 border-y border-line bg-white py-6">
          <div>
            <h3 className="font-serif text-xl">{editingId ? "Edit address" : "Add a delivery address"}</h3>
            <p className="mt-1 text-sm text-slate">Fields marked optional can be left blank.</p>
          </div>
          <TextField label="Full name" autoComplete="name" maxLength={100} value={values.fullName} onChange={(event) => changeValue("fullName", event.target.value)} error={fieldErrors.fullName} />
          <TextField label="Phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={14} value={values.phone} onChange={(event) => changeValue("phone", event.target.value)} error={fieldErrors.phone} />
          <TextField label="Address line 1" autoComplete="address-line1" maxLength={200} value={values.line1} onChange={(event) => changeValue("line1", event.target.value)} error={fieldErrors.line1} />
          <TextField label="Address line 2" autoComplete="address-line2" maxLength={200} value={values.line2 ?? ""} onChange={(event) => changeValue("line2", event.target.value)} error={fieldErrors.line2} optional />
          <TextField label="Landmark" maxLength={100} value={values.landmark ?? ""} onChange={(event) => changeValue("landmark", event.target.value)} error={fieldErrors.landmark} optional />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="City" autoComplete="address-level2" maxLength={80} value={values.city} onChange={(event) => changeValue("city", event.target.value)} error={fieldErrors.city} />
            <TextField label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} value={values.pincode} onChange={(event) => changeValue("pincode", event.target.value)} error={fieldErrors.pincode} />
          </div>
          <div>
            <label htmlFor="delivery-state" className="block text-sm font-medium">State or union territory</label>
            <select
              id="delivery-state"
              className={`field mt-1.5 ${fieldErrors.state ? "border-out" : ""}`}
              value={values.state}
              onChange={(event) => changeValue("state", event.target.value)}
              aria-invalid={!!fieldErrors.state}
              aria-describedby={fieldErrors.state ? "delivery-state-error" : undefined}
              required
            >
              <option value="">Choose a state or union territory</option>
              {states.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
            {fieldErrors.state && <p id="delivery-state-error" className="mt-1.5 text-sm text-out">{fieldErrors.state}</p>}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : editingId ? "Save changes" : "Save address"}
            </button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm && !loadError ? (
        <div className="border-y border-line bg-stone/50 px-6 py-10 text-center">
          <h3 className="font-serif text-xl">No saved addresses</h3>
          <p className="mt-1 text-sm text-slate">Add one to make checkout quicker next time.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id}>
              <article className="h-full border border-line bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{address.fullName}</h3>
                  {address.defaultAddress && <span className="rounded-full bg-platinum px-3 py-1 text-xs font-medium">Default</span>}
                </div>
                <address className="mt-3 space-y-0.5 text-sm not-italic text-slate">
                  <p>{address.phone}</p>
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  {address.landmark && <p>{address.landmark}</p>}
                  <p>{address.city}, {address.state} {address.pincode}</p>
                </address>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {!address.defaultAddress && (
                    <button type="button" disabled={busy} onClick={() => void makeDefault(address.id)} className="link disabled:opacity-50">
                      Make default
                    </button>
                  )}
                  <button type="button" disabled={busy} onClick={() => startEditing(address)} className="link disabled:opacity-50">
                    Edit
                  </button>
                  <button type="button" disabled={busy} onClick={() => void removeAddress(address)} className="text-out underline underline-offset-2 disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
