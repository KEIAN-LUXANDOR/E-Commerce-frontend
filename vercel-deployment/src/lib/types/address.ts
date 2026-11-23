export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  /** Existing API field retained for backwards compatibility with Indian PIN codes. */
  pincode: string;
  /** ISO 3166-1 alpha-2 destination country code. Older saved addresses default to IN. */
  countryCode?: string | null;
  type?: "HOME" | "WORK" | "OTHER";
  defaultAddress: boolean;
}

export type DeliveryAddress = Address;

export interface DeliveryAddressRequest {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  /** Kept as pincode to match the existing address API request contract. */
  pincode: string;
  /** Added to the existing address CRUD payload; endpoint paths are unchanged. */
  countryCode?: string;
  makeDefault?: boolean;
  type?: "HOME" | "WORK" | "OTHER";
}
