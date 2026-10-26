"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { AddressForm } from "@/components/account/AddressForm";
import { FormAlert } from "@/components/auth/FormParts";
import { deleteDeliveryAddress, getDeliveryAddresses, setDefaultDeliveryAddress } from "@/lib/api/addresses";
import type { DeliveryAddress } from "@/lib/types/address";

function sortDefaultFirst(list: DeliveryAddress[]) {
  return [...list].sort((a, b) => Number(b.defaultAddress) - Number(a.defaultAddress));
}

/** My addresses: list, add, edit, delete, choose the default (live /account/addresses endpoints). Max 10. */
export function AddressBook() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [editing, setEditing] = useState<DeliveryAddress | "new" | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      setAddresses(await getDeliveryAddresses());
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t load your addresses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function makeDefault(id: string) {
    setBusy(true);
    try {
      await setDefaultDeliveryAddress(id);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t change your default address.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(address: DeliveryAddress) {
    if (!window.confirm(`Delete the address for ${address.fullName} in ${address.city}?`)) return;
    setBusy(true);
    try {
      await deleteDeliveryAddress(address.id);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t delete this address.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div aria-busy="true" className="skeleton h-40" />;

  return (
    <section aria-labelledby="addresses-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="addresses-heading" className="text-3xl">
            Delivery addresses
          </h2>
          <p className="mt-1 text-sm text-slate">Saved addresses make checkout quicker. You can keep up to 10.</p>
        </div>
        {editing === null && addresses.length < 10 && (
          <button type="button" onClick={() => setEditing("new")} className="btn btn-secondary">
            Add an address
          </button>
        )}
      </div>

      {error && <FormAlert>{error}</FormAlert>}

      {editing !== null && (
        <div className="border border-line bg-white p-5 sm:p-6">
          <AddressForm
            key={editing === "new" ? "new" : editing.id}
            address={editing === "new" ? undefined : editing}
            heading={editing === "new" ? "New address" : "Edit address"}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              void reload();
            }}
          />
        </div>
      )}

      {addresses.length === 0 && editing === null && (
        <div className="flex flex-col items-center border border-dashed border-line-dark px-6 py-12 text-center">
          <MapPin className="size-8 text-slate" aria-hidden />
          <p className="mt-3 font-serif text-2xl">No saved addresses yet</p>
          <p className="mt-1 text-sm text-slate">Add one now, or at checkout.</p>
        </div>
      )}

      {addresses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sortDefaultFirst(addresses).map((a) => (
            <li key={a.id}>
              <article className="h-full border border-line bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium">{a.fullName}</h3>
                  {a.defaultAddress && <span className="bg-stone-deep px-2 py-1 text-xs font-medium uppercase tracking-[0.08em]">Default</span>}
                </div>
                <address className="mt-3 space-y-0.5 text-sm not-italic text-slate">
                  <p>{a.line1}</p>
                  {a.line2 && <p>{a.line2}</p>}
                  {a.landmark && <p>Near {a.landmark}</p>}
                  <p>
                    {a.city}, {a.state} {a.pincode}
                  </p>
                  <p>Mobile {a.phone}</p>
                </address>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {!a.defaultAddress && (
                    <button type="button" disabled={busy} onClick={() => void makeDefault(a.id)} className="link">
                      Make default
                    </button>
                  )}
                  <button type="button" disabled={busy} onClick={() => setEditing(a)} className="link">
                    Edit
                  </button>
                  <button type="button" disabled={busy} onClick={() => void remove(a)} className="text-out underline underline-offset-2">
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
