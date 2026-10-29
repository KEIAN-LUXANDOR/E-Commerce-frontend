"use client";

import { useState, type FormEvent } from "react";
import { AdminHeader, AdminTable, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { isEnabled } from "@/config/features";
import { createCoupon, deleteCoupon, listCoupons, updateCoupon } from "@/lib/api/admin";
import type { Coupon, CouponRequest, CouponType } from "@/lib/types/admin";
import { formatINR } from "@/lib/format";

const EMPTY: CouponRequest = {
  code: "",
  description: "",
  type: "PERCENT",
  value: 10,
  minOrderPaise: 0,
  maxDiscountPaise: null,
  startsAt: "",
  endsAt: null,
  usageLimit: null,
  active: true,
};

export default function AdminCouponsPage() {
  const enabled = isEnabled("adminCoupons");
  const coupons = useAdminQuery("adminCoupons", listCoupons, []);
  const [form, setForm] = useState(EMPTY);
  const [valueInput, setValueInput] = useState("10");
  const [minOrder, setMinOrder] = useState("0");
  const [discountCap, setDiscountCap] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  function setType(type: CouponType) {
    setForm((current) => ({ ...current, type }));
    setValueInput(type === "PERCENT" ? "10" : "");
  }

  function requestBody(): CouponRequest {
    const enteredValue = Number(valueInput);
    return {
      ...form,
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      value: form.type === "PERCENT" ? enteredValue : Math.round(enteredValue * 100),
      minOrderPaise: Math.round(Number(minOrder) * 100),
      maxDiscountPaise: form.type === "PERCENT" && discountCap ? Math.round(Number(discountCap) * 100) : null,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    };
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      await createCoupon(requestBody());
      setForm(EMPTY);
      setValueInput("10");
      setMinOrder("0");
      setDiscountCap("");
      setUsageLimit("");
      setShowForm(false);
      coupons.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create coupon.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(coupon: Coupon) {
    setBusy(true);
    setError(undefined);
    try {
      const body: CouponRequest = {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderPaise: coupon.minOrderPaise,
        maxDiscountPaise: coupon.maxDiscountPaise,
        startsAt: coupon.startsAt,
        endsAt: coupon.endsAt,
        usageLimit: coupon.usageLimit,
        active: !coupon.active,
      };
      await updateCoupon(coupon.id, body);
      coupons.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update coupon.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(coupon: Coupon) {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    setBusy(true);
    setError(undefined);
    try {
      await deleteCoupon(coupon.id);
      coupons.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete coupon.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Coupons" description="Create and manage checkout discount codes." action={<button type="button" disabled={!enabled} onClick={() => setShowForm((open) => !open)} className="btn btn-primary disabled:opacity-50">{showForm ? "Close form" : "New coupon"}</button>} />
      {!enabled && <NotConnected feature="adminCoupons" endpoints={["GET/POST /api/v1/admin/coupons"]} />}
      {error && <ErrorNote message={error} />}
      {coupons.error && <ErrorNote message={coupons.error} />}
      {showForm && enabled && (
        <form onSubmit={create} className="grid gap-4 border border-line bg-white p-5 sm:grid-cols-2">
          <label className="space-y-1 text-sm">Code<input required minLength={3} maxLength={20} value={form.code} onChange={(e) => setForm((current) => ({ ...current, code: e.target.value.toUpperCase() }))} className="field" /></label>
          <label className="space-y-1 text-sm">Description<input required value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className="field" /></label>
          <label className="space-y-1 text-sm">Discount type<select value={form.type} onChange={(e) => setType(e.target.value as CouponType)} className="field"><option value="PERCENT">Percent</option><option value="FLAT">Fixed amount</option></select></label>
          <label className="space-y-1 text-sm">{form.type === "PERCENT" ? "Discount (%)" : "Discount (₹)"}<input required type="number" min={form.type === "PERCENT" ? 1 : 0.01} max={form.type === "PERCENT" ? 100 : undefined} step={form.type === "PERCENT" ? 1 : 0.01} value={valueInput} onChange={(e) => setValueInput(e.target.value)} className="field" /></label>
          <label className="space-y-1 text-sm">Minimum order (₹)<input required type="number" min="0" step="0.01" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="field" /></label>
          {form.type === "PERCENT" && <label className="space-y-1 text-sm">Maximum discount (₹, optional)<input type="number" min="0.01" step="0.01" value={discountCap} onChange={(e) => setDiscountCap(e.target.value)} className="field" /></label>}
          <label className="space-y-1 text-sm">Starts on<input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm((current) => ({ ...current, startsAt: e.target.value }))} className="field" /></label>
          <label className="space-y-1 text-sm">Ends on (optional)<input type="datetime-local" value={form.endsAt ?? ""} onChange={(e) => setForm((current) => ({ ...current, endsAt: e.target.value || null }))} className="field" /></label>
          <label className="space-y-1 text-sm">Usage limit (optional)<input type="number" min="1" step="1" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="field" /></label>
          <div className="flex items-end"><button type="submit" disabled={busy} className="btn btn-primary">{busy ? "Creating..." : "Create coupon"}</button></div>
        </form>
      )}
      {coupons.loading && <Loading />}
      {coupons.data && coupons.data.length === 0 && <p className="border border-line bg-white p-6 text-sm text-slate">No coupons created.</p>}
      {coupons.data && coupons.data.length > 0 && (
        <AdminTable>
          <thead><tr><th>Code</th><th>Discount</th><th>Minimum</th><th>Usage</th><th>Validity</th><th>Status</th><th /></tr></thead>
          <tbody>{coupons.data.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.code}<span className="block text-xs text-slate">{coupon.description}</span></td>
              <td>{coupon.type === "PERCENT" ? `${coupon.value}%` : formatINR(coupon.value)}</td>
              <td>{formatINR(coupon.minOrderPaise)}</td>
              <td>{coupon.usedCount}{coupon.usageLimit === null ? "" : ` / ${coupon.usageLimit}`}</td>
              <td>{new Date(coupon.startsAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}{coupon.endsAt ? ` – ${new Date(coupon.endsAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}` : ""}</td>
              <td>{coupon.active ? "Active" : "Inactive"}</td>
              <td className="space-x-3 text-right"><button type="button" disabled={busy} className="btn-link" onClick={() => void toggle(coupon)}>{coupon.active ? "Deactivate" : "Activate"}</button><button type="button" disabled={busy} className="btn-link text-out" onClick={() => void remove(coupon)}>Delete</button></td>
            </tr>
          ))}</tbody>
        </AdminTable>
      )}
    </div>
  );
}
