/**
 * Customer order response follows the implemented backend order endpoints.
 */

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export interface OrderItem {
  lineNumber: number;
  productSlug: string;
  productName: string;
  sku: string;
  /** Short grade summary, e.g. "2.01 ct · F · VS1 · IGI" */
  description: string | null;
  imageUrl: string | null;
  pricePaise: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
}

export interface Shipment {
  courier: string;
  trackingNumber: string;
  /** Courier's tracking page, if any */
  trackingUrl: string | null;
  shippedAt: string;
  deliveredAt: string | null;
}

export interface Order {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  /** Unpaid orders are cancelled after this time and the diamonds go back on sale */
  expiresAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  items: OrderItem[];
  subtotalPaise: number;
  shippingPaise: number;
  discountPaise: number;
  totalPaise: number;
  currency: "INR";
  shippingAddress: ShippingAddress;
  shipment?: Shipment | null;
  /** A return request on this order, if any (planned "returns") */
  returnRequest?: ReturnRequestSummary | null;
}

export interface OrderSummary {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
  totalPaise: number;
  /** First item's photo and name, for the list */
  firstItemName: string;
  firstItemImageUrl: string | null;
}

export interface OrderListPage {
  items: OrderSummary[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

/** What the browser needs to open Razorpay Checkout for an order (from POST /account/orders/{orderNumber}/payment). */
export interface PaymentSession {
  keyId: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  orderNumber: string;
  expiresAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentConfirmation {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/** Public order tracking: no prices, no full address. */
export interface TrackingResult {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  /** City and PIN only */
  deliverTo: { city: string; pincode: string };
  shipment: Shipment | null;
  timeline: { status: OrderStatus; at: string }[];
}

export type ReturnStatus = "REQUESTED" | "APPROVED" | "RECEIVED" | "REFUNDED" | "REJECTED";

export interface ReturnRequestSummary {
  returnNumber: string;
  status: ReturnStatus;
  requestedAt: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Waiting for payment",
  PAID: "Paid — being prepared",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const RETURN_STATUS_LABEL: Record<ReturnStatus, string> = {
  REQUESTED: "Return requested",
  APPROVED: "Return approved — we'll arrange pickup",
  RECEIVED: "Returned diamond received",
  REFUNDED: "Refunded",
  REJECTED: "Return not accepted",
};
