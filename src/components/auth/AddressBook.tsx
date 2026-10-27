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
import type { DeliveryAddress } from "@/lib/types/address";
import { showToast } from "@/lib/stores";

interface AddressFormState {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormState>({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  async function loadAddresses() {
    try {
      const data = await getAddresses();
      setAddresses(data || []);
    } catch (err) {
      showToast("Failed to load addresses", { tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function handleEdit(address: any) {
    setFormData({
      firstName: address.firstName || address.name || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || address.address1 || "",
      addressLine2: address.addressLine2 || address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || address.pinCode || "",
      isDefault: address.isDefault || address.default || false,
    });
    setEditId(address.id ? String(address.id) : null);
    setShowForm(true);
    setError("");
  }

  function handleAddNew() {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: addresses.length === 0,
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
    } catch (err: any) {
      setError(err instanceof ApiError ? (err.detail || "Failed to save address") : "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string | number | undefined) {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(String(id));
      showToast("Address deleted", { tone: "success" });
      await loadAddresses();
    } catch (err: any) {
      showToast(err instanceof ApiError ? (err.detail || "Failed to delete address") : "Failed to delete address", { tone: "error" });
    }
  }

  async function handleSetDefault(id: string | number | undefined) {
    if (!id) return;
    try {
      await setDefaultAddress(String(id));
      showToast("Default address updated", { tone: "success" });
      await loadAddresses();
    } catch (err: any) {
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
            <h2 className="text-lg font-medium text-ink">Saved Addresses</h2>
            <button
              onClick={handleAddNew}
              className="flex items-center text-xs font-medium uppercase tracking-widest text-ink hover:text-loupe transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-line bg-surface py-12 px-4 text-center shadow-sm">
              <MapPin className="h-8 w-8 text-slate mb-4 opacity-50" />
              <p className="text-sm text-slate">You haven&apos;t saved any addresses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address: any) => {
                const isDef = address.isDefault || address.default;
                const fName = address.firstName || address.name || "";
                const lName = address.lastName || "";
                const line1 = address.addressLine1 || address.address1 || "";
                const line2 = address.addressLine2 || address.address2 || "";
                const pc = address.pincode || address.pinCode || "";

                return (
                  <div
                    key={address.id}
                    className={`relative flex flex-col border p-5 transition-colors shadow-sm ${
                      isDef ? "border-ink bg-surface" : "border-line bg-platinum hover:border-slate"
                    }`}
                  >
                    {isDef && (
                      <span className="absolute right-4 top-4 text-[10px] font-medium uppercase tracking-widest text-ink bg-platinum px-2 py-1">
                        Default
                      </span>
                    )}
                    <p className="font-medium text-ink text-sm">
                      {fName} {lName}
                    </p>
                    <p className="mt-2 text-sm text-slate line-clamp-3 leading-relaxed">
                      {line1}
                      {line2 && `, ${line2}`}
                      <br />
                      {address.city}, {address.state} {pc}
                    </p>
                    <p className="mt-3 text-sm text-ink">{address.phone}</p>

                    <div className="mt-5 flex items-center gap-4 border-t border-line pt-4">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-xs font-medium text-slate hover:text-ink transition-colors flex items-center uppercase tracking-widest"
                      >
                        <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-xs font-medium text-out hover:opacity-80 transition-colors flex items-center uppercase tracking-widest"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                      </button>
                      {!isDef && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="ml-auto text-[10px] uppercase tracking-widest font-medium text-ink hover:underline"
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
        <div className="border border-line bg-surface p-6 shadow-sm">
          <h3 className="mb-6 text-base font-medium text-ink">
            {editId !== null ? "Edit Address" : "Add New Address"}
          </h3>

          {error && (
             <div className="mb-6 p-4 bg-out/5 border border-out text-out text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">Address Line 1</label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink uppercase tracking-widest mb-2">PIN Code</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full h-11 border border-line bg-surface px-4 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 transition-colors"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 pt-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded-none border-line text-ink focus:ring-ink focus:ring-offset-0 bg-surface checked:bg-ink"
              />
              <span className="text-sm text-ink group-hover:text-loupe transition-colors">Set as default delivery address</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-11 flex items-center justify-center bg-ink text-white text-xs font-medium uppercase tracking-widest hover:bg-loupe-deep transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="flex-1 h-11 flex items-center justify-center border border-line bg-surface text-ink text-xs font-medium uppercase tracking-widest hover:bg-platinum transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddressBook;