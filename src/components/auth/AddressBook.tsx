"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Edit2, MapPin } from "lucide-react";
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

export function AddressBook() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DeliveryAddressRequest>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  async function loadAddresses() {
    try {
      const data = await getAddresses();
      setAddresses(data || []);
    } catch {
      showToast("Failed to load addresses", { tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getAddresses()
      .then((data) => {
        if (active) setAddresses(data || []);
      })
      .catch(() => {
        if (active) showToast("Failed to load addresses", { tone: "error" });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleEdit(address: DeliveryAddress) {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      line1: address.line1 || "",
      line2: address.line2 || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });
    setEditId(address.id);
    setShowForm(true);
    setError("");
  }

  function handleAddNew() {
    setFormData({
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    });
    setEditId(null);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editId) {
        await updateAddress(editId, formData);
        showToast("Address updated successfully", { tone: "success" });
      } else {
        await createAddress(formData);
        showToast("Address added successfully", { tone: "success" });
      }
      await loadAddresses();
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? (err.detail || "Failed to save address") : "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      showToast("Address deleted", { tone: "success" });
      await loadAddresses();
    } catch (err: unknown) {
      showToast(err instanceof ApiError ? (err.detail || "Failed to delete address") : "Failed to delete address", { tone: "error" });
    }
  }

  async function handleSetDefault(id: string) {
    if (!id) return;
    try {
      await setDefaultAddress(id);
      showToast("Default address updated", { tone: "success" });
      await loadAddresses();
    } catch {
      showToast("Failed to set default address", { tone: "error" });
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {!showForm ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium font-serif text-ink">Saved Addresses</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNew}
              leftIcon={<Plus className="size-3.5" />}
            >
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface py-12 px-4 text-center shadow-xs">
              <MapPin className="h-8 w-8 text-slate mb-4 opacity-50" />
              <p className="text-sm text-slate">You haven&apos;t saved any addresses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => {
                const isDef = address.defaultAddress;

                return (
                  <div
                    key={address.id}
                    className={`relative flex flex-col rounded-xl border p-5 transition-colors shadow-xs ${
                      isDef ? "border-ink bg-surface ring-1 ring-ink/10" : "border-line bg-stone hover:border-slate"
                    }`}
                  >
                    {isDef && (
                      <span className="absolute right-4 top-4 text-[10px] font-mono font-semibold uppercase tracking-wider text-ink bg-platinum px-2 py-0.5 rounded border border-line">
                        Default
                      </span>
                    )}
                    <p className="font-semibold text-ink text-sm">
                      {address.fullName}
                    </p>
                    <p className="mt-2 text-xs text-slate line-clamp-3 leading-relaxed font-mono">
                      {address.line1}
                      {address.line2 && `, ${address.line2}`}
                      {address.landmark && ` (near ${address.landmark})`}
                      <br />
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="mt-3 text-xs font-mono font-medium text-ink">{address.phone}</p>

                    <div className="mt-5 flex items-center gap-4 border-t border-line/60 pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(address)}
                        className="text-xs font-semibold text-slate hover:text-ink transition-colors flex items-center uppercase tracking-wider"
                      >
                        <Edit2 className="mr-1.5 size-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        className="text-xs font-semibold text-out hover:opacity-80 transition-colors flex items-center uppercase tracking-wider"
                      >
                        <Trash2 className="mr-1.5 size-3.5" /> Delete
                      </button>
                      {!isDef && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          className="ml-auto text-[11px] uppercase tracking-wider font-semibold text-ink hover:underline"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
          <h3 className="mb-6 text-base font-serif font-medium text-ink">
            {editId !== null ? "Edit Delivery Address" : "Add New Delivery Address"}
          </h3>

          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-out/10 border border-out/30 text-out text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="addressbook-f1" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input id="addressbook-f1"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                placeholder="Full name as on ID"
              />
            </div>

            <div>
              <label htmlFor="addressbook-f2" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input id="addressbook-f2"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                placeholder="10-digit Indian mobile number"
              />
            </div>

            <div>
              <label htmlFor="addressbook-f3" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Address Line 1
              </label>
              <input id="addressbook-f3"
                type="text"
                required
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                placeholder="House/flat number, building name, street"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="addressbook-f4" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Address Line 2 (Optional)
                </label>
                <input id="addressbook-f4"
                  type="text"
                  value={formData.line2 ?? ""}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  placeholder="Area, colony"
                />
              </div>
              <div>
                <label htmlFor="addressbook-f5" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Landmark (Optional)
                </label>
                <input id="addressbook-f5"
                  type="text"
                  value={formData.landmark ?? ""}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  placeholder="Nearby prominent landmark"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="addressbook-f6" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">City</label>
                <input id="addressbook-f6"
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  placeholder="Pune"
                />
              </div>
              <div>
                <label htmlFor="addressbook-f7" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">State</label>
                <input id="addressbook-f7"
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label htmlFor="addressbook-f8" className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">PIN Code</label>
                <input id="addressbook-f8"
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full h-11 rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none transition-colors"
                  placeholder="411045"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                size="md"
                disabled={submitting}
                isLoading={submitting}
                className="flex-1"
              >
                Save Address
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddressBook;