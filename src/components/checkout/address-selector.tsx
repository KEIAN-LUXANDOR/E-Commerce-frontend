"use client";

import * as React from "react";
import { Check, ChevronDown, MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";
import { AddressEntryForm } from "@/components/address/AddressEntryForm";
import { SlideDownPanel } from "@/components/address/SlideDownPanel";
import { useMarket } from "@/components/market/MarketProvider";
import { getAddressCountryCode, getAddressCountryName } from "@/lib/market/address-validation";

interface AddressSelectorProps {
  savedAddresses: DeliveryAddress[];
  selectedId: string | null;
  onSelect: (address: DeliveryAddress) => void;
  onNewAddress: (req: DeliveryAddressRequest) => Promise<DeliveryAddress>;
  className?: string;
}

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: DeliveryAddress;
  selected: boolean;
  onSelect: () => void;
}) {
  const countryCode = getAddressCountryCode(address.countryCode);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-xl border bg-white p-4 text-left transition-all duration-200",
        selected
          ? "border-brand-accent ring-1 ring-brand-accent/20"
          : "border-line hover:border-brand-accent/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg",
              selected ? "bg-ink text-white" : "bg-stone text-slate",
            )}
          >
            <MapPin className="size-4" aria-hidden="true" />
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">
              {address.fullName}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
              <br />
              {address.city}
              {address.state ? `, ${address.state}` : ""} {address.pincode}
              <br />
              {getAddressCountryName(countryCode)}
            </span>
            <span className="mt-2 block text-xs text-slate">{address.phone}</span>
          </span>
        </div>

        {selected && (
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-white">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
        )}
      </div>

      {address.defaultAddress && (
        <span className="ml-12 mt-3 inline-flex rounded-full border border-line bg-stone px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
          Default address
        </span>
      )}
    </button>
  );
}

/**
 * Address selection for checkout.
 *
 * Delivery availability and estimates are intentionally not checked here.
 * The order API remains responsible for validating whether an address can
 * actually be fulfilled when an order is created.
 */
export function AddressSelector({
  savedAddresses,
  selectedId,
  onSelect,
  onNewAddress,
  className,
}: AddressSelectorProps) {
  const { countryCode: marketCountryCode } = useMarket();
  const [showForm, setShowForm] = React.useState(savedAddresses.length === 0);
  const [formKey, setFormKey] = React.useState(0);

  function openNewAddress() {
    setFormKey((key) => key + 1);
    setShowForm(true);
  }

  function handleSelectAddress(address: DeliveryAddress) {
    setShowForm(false);
    onSelect({
      ...address,
      countryCode: address.countryCode || "IN",
    });
  }

  async function handleNewAddress(request: DeliveryAddressRequest) {
    const saved = await onNewAddress(request);
    setShowForm(false);
    onSelect({
      ...saved,
      countryCode: saved.countryCode || request.countryCode || marketCountryCode,
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      {savedAddresses.length > 0 && (
        <div className="space-y-2">
          {savedAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={address.id === selectedId}
              onSelect={() => handleSelectAddress(address)}
            />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-line p-3">
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
            } else {
              openNewAddress();
            }
          }}
          aria-expanded={showForm}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-2 text-left text-sm font-semibold text-ink transition-colors hover:bg-stone/70"
        >
          <span className="flex items-center gap-2">
            <Plus className="size-4 text-brand-accent" aria-hidden="true" />
            Add a new delivery address
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-slate transition-transform duration-300",
              showForm && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        <SlideDownPanel open={showForm}>
          <AddressEntryForm
            key={formKey}
            defaultCountryCode={marketCountryCode}
            onSubmit={handleNewAddress}
            onCancel={() => setShowForm(false)}
            submitLabel="Save and use this address"
          />
        </SlideDownPanel>
      </div>
    </div>
  );
}

export default AddressSelector;
