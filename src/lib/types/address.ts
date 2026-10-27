export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  type?: "HOME" | "WORK" | "OTHER";
  defaultAddress: boolean;
}

// Alias to satisfy older component imports if they use DeliveryAddress
export type DeliveryAddress = Address;

export interface DeliveryAddressRequest {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  makeDefault?: boolean;
  type?: "HOME" | "WORK" | "OTHER";
}