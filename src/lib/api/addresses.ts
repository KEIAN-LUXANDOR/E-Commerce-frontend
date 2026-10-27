import { apiFetch } from "./client";
import type { Address } from "@/lib/types/address";

export async function getAddresses(): Promise<Address[]> {
  return apiFetch<Address[]>("/account/addresses");
}

export async function getStates(): Promise<string[]> {
  return apiFetch<string[]>("/account/addresses/states");
}

export async function createAddress(data: Partial<Address>): Promise<Address> {
  return apiFetch<Address>("/account/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(id: string, data: Partial<Address>): Promise<Address> {
  return apiFetch<Address>(`/account/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function setDefaultAddress(id: string): Promise<Address> {
  return apiFetch<Address>(`/account/addresses/${id}/default`, {
    method: "PUT",
  });
}

export async function deleteAddress(id: string): Promise<void> {
  return apiFetch<void>(`/account/addresses/${id}`, {
    method: "DELETE",
  });
}