
"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import type {
  DeliveryAddress,
  DeliveryAddressRequest,
} from "@/lib/types/address";
import { showToast } from "@/lib/stores";
import { Button } from "@/components/ui/button";

const EMPTY_ADDRESS: DeliveryAddressRequest = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60";

const LABEL_CLASS =
  "mb-1.5 block text-xs font-semibold text-ink";

export function AddressBook() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<DeliveryAddressRequest>(EMPTY_ADDRESS);

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
        if (active) {
          showToast("Failed to load addresses", { tone: "error" });
        }
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
    setFormData({ ...EMPTY_ADDRESS });
    setEditId(null);
    setShowForm(true);
    setError("");
  }

  function handleCancel() {
    setShowForm(false);
    setEditId(null);
    setError("");
    setFormData({ ...EMPTY_ADDRESS });
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
      handleCancel();
    } catch (err: unknown) {
      setError(
        err instanceof ApiError
          ? err.detail || "Failed to save address"
          : "Failed to save address",
      );
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
      showToast(
        err instanceof ApiError
          ? err.detail || "Failed to delete address"
          : "Failed to delete address",
        { tone: "error" },
      );
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

  function updateField<K extends keyof DeliveryAddressRequest>(
    field: K,
    value: DeliveryAddressRequest[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {!showForm ? (
        <section>
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-medium text-ink">
                Saved Addresses
              </h2>
              <p className="mt-1 text-sm text-slate">
                Manage your delivery destinations.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNew}
              leftIcon={<Plus className="size-4" />}
            >
              Add Address
            </Button>
          </div>

          {/* Empty state */}
          {addresses.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface px-5 py-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-stone text-slate">
                <MapPin className="size-6" strokeWidth={1.5} />
              </div>

              <h3 className="font-serif text-lg font-medium text-ink">
                No saved addresses
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate">
                Add a delivery address to make your future orders easier.
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNew}
                leftIcon={<Plus className="size-4" />}
                className="mt-5"
              >
                Add your first address
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => {
                const isDef = address.defaultAddress;

                return (
                  <article
                    key={address.id}
                    className={`group relative flex min-w-0 flex-col rounded-xl border p-5 transition-colors ${
                      isDef
                        ? "border-ink/30 bg-surface"
                        : "border-line bg-surface hover:border-slate/60"
                    }`}
                  >
                    {/* Card header */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                            isDef
                              ? "bg-ink text-white"
                              : "bg-stone text-slate"
                          }`}
                        >
                          <MapPin className="size-4" strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-ink">
                            {address.fullName}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate">
                            Delivery address
                          </p>
                        </div>
                      </div>

                      {isDef && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 bg-stone px-2.5 py-1 text-[10px] font-semibold text-ink">
                          <CheckCircle2 className="size-3" />
                          Default
                        </span>
                      )}
                    </div>

                    {/* Address details */}
                    <div className="min-w-0 flex-1 pl-0.5">
                      <p className="text-sm leading-6 text-slate">
                        {address.line1}
                        {address.line2 && `, ${address.line2}`}
                      </p>

                      {address.landmark && (
                        <p className="mt-1 text-xs text-slate">
                          Near {address.landmark}
                        </p>
                      )}

                      <p className="mt-1 text-sm font-medium text-ink">
                        {address.city}, {address.state} {address.pincode}
                      </p>

                      <p className="mt-3 text-xs font-medium text-slate">
                        {address.phone}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(address)}
                        aria-label={`Edit address for ${address.fullName}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                      >
                        <Edit2 className="size-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        aria-label={`Delete address for ${address.fullName}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-out transition-colors hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-out focus-visible:ring-offset-2"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>

                      {!isDef && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          className="ml-auto text-xs font-semibold text-ink transition-colors hover:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                        >
                          Make default
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          {/* Form heading */}
          <div className="flex items-start justify-between gap-4 border-b border-line bg-stone/40 px-5 py-5 sm:px-7">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate">
                Delivery details
              </p>

              <h2 className="font-serif text-xl font-medium text-ink">
                {editId ? "Edit Address" : "Add New Address"}
              </h2>

              <p className="mt-1 text-sm text-slate">
                Enter the details for your delivery destination.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              aria-label="Close address form"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-slate transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-out/30 bg-out/10 px-4 py-3 text-sm text-out"
              >
                {error}
              </div>
            )}

            {/* Contact information */}
            <div className="mb-7">
              <h3 className="mb-4 text-sm font-semibold text-ink">
                Contact information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="addressbook-f1" className={LABEL_CLASS}>
                    Full Name <span className="text-out">*</span>
                  </label>
                  <input
                    id="addressbook-f1"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="Full name as on ID"
                  />
                </div>

                <div>
                  <label htmlFor="addressbook-f2" className={LABEL_CLASS}>
                    Mobile Number <span className="text-out">*</span>
                  </label>
                  <input
                    id="addressbook-f2"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Address information */}
            <div className="mb-7 border-t border-line pt-6">
              <h3 className="mb-4 text-sm font-semibold text-ink">
                Address information
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="addressbook-f3" className={LABEL_CLASS}>
                    Address Line 1 <span className="text-out">*</span>
                  </label>
                  <input
                    id="addressbook-f3"
                    type="text"
                    required
                    autoComplete="address-line1"
                    value={formData.line1}
                    onChange={(e) => updateField("line1", e.target.value)}
                    className={INPUT_CLASS}
                    placeholder="House/flat number, building name, street"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="addressbook-f4" className={LABEL_CLASS}>
                      Address Line 2
                      <span className="ml-1 font-normal text-slate">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="addressbook-f4"
                      type="text"
                      autoComplete="address-line2"
                      value={formData.line2 ?? ""}
                      onChange={(e) => updateField("line2", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="Area, colony"
                    />
                  </div>

                  <div>
                    <label htmlFor="addressbook-f5" className={LABEL_CLASS}>
                      Landmark
                      <span className="ml-1 font-normal text-slate">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="addressbook-f5"
                      type="text"
                      value={formData.landmark ?? ""}
                      onChange={(e) => updateField("landmark", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="Nearby prominent landmark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="addressbook-f6" className={LABEL_CLASS}>
                      City <span className="text-out">*</span>
                    </label>
                    <input
                      id="addressbook-f6"
                      type="text"
                      required
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label htmlFor="addressbook-f7" className={LABEL_CLASS}>
                      State <span className="text-out">*</span>
                    </label>
                    <input
                      id="addressbook-f7"
                      type="text"
                      required
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label htmlFor="addressbook-f8" className={LABEL_CLASS}>
                      PIN Code <span className="text-out">*</span>
                    </label>
                    <input
                      id="addressbook-f8"
                      type="text"
                      required
                      autoComplete="postal-code"
                      value={formData.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder="PIN code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleCancel}
                disabled={submitting}
                className="sm:min-w-32"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="md"
                disabled={submitting}
                isLoading={submitting}
                className="sm:min-w-40"
              >
                {editId ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default AddressBook;
