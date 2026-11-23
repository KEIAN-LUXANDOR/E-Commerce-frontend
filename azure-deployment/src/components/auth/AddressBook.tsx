"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Edit2, Loader2, MapPin, Plus, Trash2, X } from "lucide-react";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { AddressEntryForm } from "@/components/address/AddressEntryForm";
import { SlideDownPanel } from "@/components/address/SlideDownPanel";
import { useMarket } from "@/components/market/MarketProvider";
import { getAddressCountryCode, getAddressCountryName } from "@/lib/market/address-validation";

export function AddressBook() {
  const { countryCode: marketCountryCode } = useMarket();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formSeed, setFormSeed] = useState<Partial<DeliveryAddressRequest>>({ countryCode: marketCountryCode });
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    let active = true;
    getAddresses()
      .then((data) => {
        if (active) setAddresses((data || []).map((address) => ({ ...address, countryCode: address.countryCode || "IN" })));
      })
      .catch(() => {
        if (active) showToast("Failed to load addresses", { tone: "error" });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function openNewAddress() {
    setEditId(null);
    setFormSeed({ countryCode: marketCountryCode, type: "HOME", makeDefault: addresses.length === 0 });
    setFormKey((key) => key + 1);
    setShowForm(true);
  }

  function openEditAddress(address: DeliveryAddress) {
    setEditId(address.id);
    setFormSeed({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      landmark: address.landmark ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      countryCode: getAddressCountryCode(address.countryCode),
      type: address.type ?? "HOME",
    });
    setFormKey((key) => key + 1);
    setShowForm(true);
  }

  async function handleSave(request: DeliveryAddressRequest) {
    setSubmitting(true);
    try {
      if (editId) {
        const updated = await updateAddress(editId, request);
        setAddresses((current) => current.map((address) => address.id === editId ? { ...updated, countryCode: updated.countryCode || request.countryCode } : address));
        showToast("Address updated successfully", { tone: "success" });
      } else {
        const created = await createAddress(request);
        setAddresses((current) => [...current, { ...created, countryCode: created.countryCode || request.countryCode }]);
        showToast("Address added successfully", { tone: "success" });
      }
      setShowForm(false);
      setEditId(null);
    } catch (error) {
      const message = error instanceof ApiError ? error.detail || error.message : error instanceof Error ? error.message : "Failed to save address";
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!id || !window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses((current) => current.filter((address) => address.id !== id));
      showToast("Address deleted", { tone: "success" });
    } catch (error) {
      showToast(error instanceof ApiError ? error.detail || "Failed to delete address" : "Failed to delete address", { tone: "error" });
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
      setAddresses((current) => current.map((address) => ({ ...address, defaultAddress: address.id === id })));
      showToast("Default address updated", { tone: "success" });
    } catch {
      showToast("Failed to set default address", { tone: "error" });
    }
  }

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="size-6 animate-spin text-slate" /></div>;
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-medium text-ink">Saved Addresses</h2>
          <p className="mt-1 text-sm text-slate">Manage delivery destinations across your selected markets.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => showForm ? setShowForm(false) : openNewAddress()}
          leftIcon={showForm ? <X className="size-4" /> : <Plus className="size-4" />}
        >
          {showForm ? "Close form" : "Add Address"}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-5 py-10 text-center">
          <div className="mb-3 grid size-12 place-items-center rounded-full bg-stone text-slate"><MapPin className="size-5" /></div>
          <h3 className="font-serif text-lg text-ink">No saved addresses yet</h3>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate">Add your delivery details once and keep them ready for your next order.</p>
          <Button variant="outline" size="sm" onClick={openNewAddress} leftIcon={<Plus className="size-4" />} className="mt-4">Add your first address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => {
            const country = getAddressCountryName(address.countryCode);
            return (
              <article key={address.id} className={`flex min-w-0 flex-col rounded-2xl border p-5 transition-colors ${address.defaultAddress ? "border-brand-accent/45 bg-surface" : "border-line bg-surface hover:border-brand-accent/35"}`}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${address.defaultAddress ? "bg-ink text-white" : "bg-stone text-slate"}`}><MapPin className="size-4" /></span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-ink">{address.fullName}</h3>
                      <p className="mt-0.5 text-xs text-slate">{country}</p>
                    </div>
                  </div>
                  {address.defaultAddress && <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-accent/20 bg-brand-accent-muted/50 px-2.5 py-1 text-[10px] font-semibold text-ink"><CheckCircle2 className="size-3" /> Default</span>}
                </div>

                <div className="min-w-0 flex-1 pl-0.5">
                  <p className="text-sm leading-6 text-slate">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                  {address.landmark && <p className="mt-1 text-xs text-slate">Near {address.landmark}</p>}
                  <p className="mt-1 text-sm font-medium text-ink">{address.city}, {address.state} {address.pincode}</p>
                  <p className="mt-1 text-xs text-slate">{country}</p>
                  <p className="mt-3 text-xs font-medium text-slate">{address.phone}</p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4">
                  <button type="button" onClick={() => openEditAddress(address)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate transition-colors hover:text-ink"><Edit2 className="size-3.5" /> Edit</button>
                  <button type="button" onClick={() => void handleDelete(address.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-out transition-colors hover:opacity-75"><Trash2 className="size-3.5" /> Delete</button>
                  {!address.defaultAddress && <button type="button" onClick={() => void handleSetDefault(address.id)} className="ml-auto text-xs font-semibold text-ink transition-colors hover:text-brand-accent">Make default</button>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <SlideDownPanel open={showForm}>
        <AddressEntryForm
          key={formKey}
          initialAddress={formSeed}
          defaultCountryCode={marketCountryCode}
          onSubmit={handleSave}
          onCancel={() => { if (!submitting) { setShowForm(false); setEditId(null); } }}
          submitLabel={editId ? "Update address" : "Save address"}
        />
      </SlideDownPanel>
    </div>
  );
}
