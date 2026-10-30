"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader, ErrorNote, Loading, NotConnected, useAdminQuery } from "@/components/admin/AdminBits";
import { isEnabled } from "@/config/features";
import { createAdminProduct, getAdminProduct, updateAdminProduct } from "@/lib/api/admin";
import type { AdminProduct, AdminProductRequest, ProductStatus } from "@/lib/types/admin";
import {
  CLARITY_VALUES,
  COLOR_VALUES,
  CUT_VALUES,
  FINISH_VALUES,
  FLUORESCENCE_VALUES,
  LAB_VALUES,
  ORIGIN_VALUES,
  SHAPE_VALUES,
  type Diamond,
} from "@/lib/types/product";

type FormValues = {
  name: string;
  description: string;
  sku: string;
  priceDollars: string;
  mrpDollars: string;
  stock: string;
  status: ProductStatus;
  diamond: Diamond;
};

const EMPTY_DIAMOND: Diamond = {
  origin: "NATURAL",
  shape: "ROUND",
  carat: 1,
  color: "D",
  clarity: "VS1",
  cut: "EXCELLENT",
  polish: "EXCELLENT",
  symmetry: "EXCELLENT",
  fluorescence: "NONE",
  lab: "GIA",
  quickShip: false,
};

const EMPTY_FORM: FormValues = {
  name: "",
  description: "",
  sku: "",
  priceDollars: "",
  mrpDollars: "",
  stock: "1",
  status: "DRAFT",
  diamond: EMPTY_DIAMOND,
};

function valuesFromProduct(product: AdminProduct | null | undefined): FormValues {
  if (!product) return EMPTY_FORM;
  return {
    name: product.name,
    description: product.description ?? "",
    sku: product.variant.sku,
    priceDollars: String(product.variant.pricePaise / 100),
    mrpDollars: product.variant.mrpPaise === null ? "" : String(product.variant.mrpPaise / 100),
    stock: String(product.variant.stockQuantity),
    status: product.status,
    diamond: product.diamond ?? EMPTY_DIAMOND,
  };
}

export function DiamondForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const enabled = isEnabled("adminCatalog");
  const productQuery = useAdminQuery(
    "adminCatalog",
    () => (productId ? getAdminProduct(productId) : Promise.resolve(null)),
    [productId],
  );
  const [editedValues, setEditedValues] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const values = editedValues ?? valuesFromProduct(productQuery.data);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setEditedValues((current) => ({ ...(current ?? valuesFromProduct(productQuery.data)), [key]: value }));
  }

  function setDiamond<K extends keyof Diamond>(key: K, value: Diamond[K]) {
    setEditedValues((current) => {
      const base = current ?? valuesFromProduct(productQuery.data);
      return {
        ...base,
        diamond: { ...base.diamond, [key]: value },
      };
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (!enabled) return;
    const price = Number(values.priceDollars);
    const mrp = values.mrpDollars.trim() ? Number(values.mrpDollars) : null;
    const stock = Number(values.stock);
    if (!Number.isFinite(price) || price <= 0 || (mrp !== null && (!Number.isFinite(mrp) || mrp < price))) {
      setError("Enter a valid price and an MRP that is at least the selling price.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a whole number greater than or equal to zero.");
      return;
    }

    const body: AdminProductRequest = {
      name: values.name.trim(),
      description: values.description.trim(),
      status: values.status,
      sku: values.sku.trim(),
      pricePaise: Math.round(price * 100),
      mrpPaise: mrp === null ? null : Math.round(mrp * 100),
      stockQuantity: stock,
      diamond: values.diamond,
    };

    setSaving(true);
    try {
      if (productId) {
        await updateAdminProduct(productId, body);
        setEditedValues(null);
        productQuery.reload();
      } else {
        await createAdminProduct(body);
        router.push("/admin/inventory");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this diamond.");
    } finally {
      setSaving(false);
    }
  }

  if (productQuery.loading) return <Loading />;
  if (productQuery.error) return <ErrorNote message={productQuery.error} />;
  if (productId && productQuery.data === null) return <ErrorNote message="Diamond not found." />;

  return (
    <div className="space-y-6">
      <AdminHeader title={productId ? "Edit diamond" : "Add a diamond"} back={{ href: "/admin/inventory", label: "Inventory" }} />
      {!enabled && <NotConnected feature="adminCatalog" endpoints={["POST /api/v1/admin/products", "PUT /api/v1/admin/products/{id}"]} />}
      {error && <ErrorNote message={error} />}
      <form onSubmit={submit} className="space-y-6 border border-line bg-white p-5">
        <fieldset disabled={!enabled || saving} className="space-y-6 disabled:opacity-70">
          <section className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">Name
              <input required value={values.name} onChange={(e) => setField("name", e.target.value)} className="field" />
            </label>
            <label className="space-y-1 text-sm">SKU
              <input required value={values.sku} onChange={(e) => setField("sku", e.target.value)} className="field" />
            </label>
            <label className="space-y-1 text-sm">Price ($)
              <input required type="number" min="0.01" step="0.01" value={values.priceDollars} onChange={(e) => setField("priceDollars", e.target.value)} className="field" />
            </label>
            <label className="space-y-1 text-sm">Compare-at price ($, optional)
              <input type="number" min="0.01" step="0.01" value={values.mrpDollars} onChange={(e) => setField("mrpDollars", e.target.value)} className="field" />
            </label>
            <label className="space-y-1 text-sm">Stock
              <input required type="number" min="0" step="1" value={values.stock} onChange={(e) => setField("stock", e.target.value)} className="field" />
            </label>
            <label className="space-y-1 text-sm">Status
              <select value={values.status} onChange={(e) => setField("status", e.target.value as ProductStatus)} className="field">
                <option value="DRAFT">Draft</option><option value="ACTIVE">On sale</option><option value="ARCHIVED">Archived</option>
              </select>
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">Description
              <textarea value={values.description} onChange={(e) => setField("description", e.target.value)} className="field min-h-24 py-3" />
            </label>
          </section>

          <section className="grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <label className="space-y-1 text-sm">Origin
              <select value={values.diamond.origin} onChange={(e) => setDiamond("origin", e.target.value as Diamond["origin"])} className="field">
                {ORIGIN_VALUES.map((v) => <option key={v} value={v}>{v.replace("_", " ")}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm">Shape
              <select value={values.diamond.shape} onChange={(e) => setDiamond("shape", e.target.value as Diamond["shape"])} className="field">
                {SHAPE_VALUES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm">Carat
              <input required type="number" min="0.01" step="0.01" value={values.diamond.carat} onChange={(e) => setDiamond("carat", Number(e.target.value))} className="field" />
            </label>
            <label className="space-y-1 text-sm">Color
              <select value={values.diamond.color} onChange={(e) => setDiamond("color", e.target.value as Diamond["color"])} className="field">{COLOR_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="space-y-1 text-sm">Clarity
              <select value={values.diamond.clarity} onChange={(e) => setDiamond("clarity", e.target.value as Diamond["clarity"])} className="field">{CLARITY_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="space-y-1 text-sm">Cut
              <select value={values.diamond.cut ?? ""} onChange={(e) => setDiamond("cut", (e.target.value || null) as Diamond["cut"])} className="field"><option value="">Not graded</option>{CUT_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="space-y-1 text-sm">Polish
              <select value={values.diamond.polish} onChange={(e) => setDiamond("polish", e.target.value as Diamond["polish"])} className="field">{FINISH_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="space-y-1 text-sm">Symmetry
              <select value={values.diamond.symmetry} onChange={(e) => setDiamond("symmetry", e.target.value as Diamond["symmetry"])} className="field">{FINISH_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="space-y-1 text-sm">Fluorescence
              <select value={values.diamond.fluorescence} onChange={(e) => setDiamond("fluorescence", e.target.value as Diamond["fluorescence"])} className="field">{FLUORESCENCE_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="space-y-1 text-sm">Lab
              <select value={values.diamond.lab} onChange={(e) => setDiamond("lab", e.target.value as Diamond["lab"])} className="field">{LAB_VALUES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-3">
              <input type="checkbox" checked={values.diamond.quickShip} onChange={(e) => setDiamond("quickShip", e.target.checked)} />
              Quick ship
            </label>
          </section>
        </fieldset>
        <button type="submit" disabled={!enabled || saving} className="btn btn-primary disabled:pointer-events-none disabled:opacity-50">
          {saving ? "Saving..." : productId ? "Save changes" : "Create diamond"}
        </button>
      </form>
    </div>
  );
}

export default DiamondForm;
