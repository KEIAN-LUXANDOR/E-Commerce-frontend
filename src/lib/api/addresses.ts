import { apiFetch } from "@/lib/api/client";
import type { DeliveryAddress, DeliveryAddressRequest } from "@/lib/types/address";

const ADDRESS_PATH = "/account/addresses";

export function getDeliveryAddresses() {
  return apiFetch<DeliveryAddress[]>(ADDRESS_PATH, { cache: "no-store" });
}

export function getIndianStates() {
  return apiFetch<string[]>(`${ADDRESS_PATH}/states`, { cache: "no-store" });
}

export function createDeliveryAddress(body: DeliveryAddressRequest) {
  return apiFetch<DeliveryAddress>(ADDRESS_PATH, { method: "POST", body });
}

export function updateDeliveryAddress(id: string, body: DeliveryAddressRequest) {
  return apiFetch<DeliveryAddress>(`${ADDRESS_PATH}/${encodeURIComponent(id)}`, { method: "PUT", body });
}

export function setDefaultDeliveryAddress(id: string) {
  return apiFetch<DeliveryAddress>(`${ADDRESS_PATH}/${encodeURIComponent(id)}/default`, { method: "PUT" });
}

export function deleteDeliveryAddress(id: string) {
  return apiFetch<void>(`${ADDRESS_PATH}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
