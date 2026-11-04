import { apiFetch } from "./client";
import type { Address, DeliveryAddressRequest } from "@/lib/types/address";

/** Existing account-address endpoints. Country is carried in the existing DTO payload. */
export async function getAddresses(): Promise<Address[]> {
  return apiFetch<Address[]>("/account/addresses");
}

/** Existing India-state lookup, used by legacy integrations where needed. */
export async function getStates(): Promise<string[]> {
  return apiFetch<string[]>("/account/addresses/states");
}

export async function createAddress(data: DeliveryAddressRequest): Promise<Address> {
  return apiFetch<Address>("/account/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(id: string, data: DeliveryAddressRequest): Promise<Address> {
  return apiFetch<Address>(`/account/addresses/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function setDefaultAddress(id: string): Promise<Address> {
  return apiFetch<Address>(`/account/addresses/${encodeURIComponent(id)}/default`, {
    method: "PUT",
  });
}

export async function deleteAddress(id: string): Promise<void> {
  return apiFetch<void>(`/account/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export const getDeliveryAddresses = getAddresses;
export const getIndianStates = getStates;
export const createDeliveryAddress = createAddress;
export const updateDeliveryAddress = updateAddress;
export const setDefaultDeliveryAddress = setDefaultAddress;
export const deleteDeliveryAddress = deleteAddress;
