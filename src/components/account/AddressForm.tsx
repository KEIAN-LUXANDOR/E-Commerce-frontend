"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createAddress, updateAddress } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api/client";
import { showToast } from "@/lib/stores";

export function AddressForm({ addressId, onSuccess }: { addressId?: string | number; onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statesCache, setStatesCache] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
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

  useEffect(() => {
    setStatesCache(["Maharashtra", "Karnataka", "Delhi", "Gujarat", "Madhya Pradesh"]);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      if (addressId) {
        await updateAddress(String(addressId), form);
        showToast("Address updated successfully", { tone: "success" });
      } else {
        await createAddress(form);
        showToast("Address created successfully", { tone: "success" });
      }
      onSuccess?.();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to save address.");
        if (err.errors) {
          const fe: Record<string, string> = {};
          err.errors.forEach((e: any) => { fe[e.field] = e.message; });
          setFieldErrors(fe);
        }
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-out/10 text-out text-sm">{error}</div>}
      <div>
        <label className="block text-xs font-medium uppercase mb-1">First Name</label>
        <input
          type="text"
          required
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full h-10 border px-3 text-sm"
        />
        {fieldErrors.firstName && <p className="text-xs text-out mt-1">{fieldErrors.firstName}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">Last Name</label>
        <input
          type="text"
          required
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">Phone</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">Address Line 1</label>
        <input
          type="text"
          required
          value={form.addressLine1}
          onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">City</label>
        <input
          type="text"
          required
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">State</label>
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="w-full h-10 border px-3 text-sm bg-surface"
        >
          <option value="">Select State</option>
          {statesCache?.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase mb-1">PIN Code</label>
        <input
          type="text"
          required
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          className="w-full h-10 border px-3 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-ink text-white text-xs uppercase tracking-widest font-medium"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save Address"}
      </button>
    </form>
  );
}

export default AddressForm;