import type { Diamond, ProductImage } from "@/lib/types/product";
import type { Order, OrderStatus, ReturnStatus, Shipment } from "@/lib/types/order";

/** PLANNED admin endpoints (/api/v1/admin/**, ADMIN role). See docs/API-ENDPOINTS.md. */

export interface Paged<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

/** Grades the admin enters (the certificate fields are optional). */
export type DiamondInput = Omit<Diamond, "verifyUrl" | "lwRatio">;

export interface AdminImage extends ProductImage {
  id: string;
  sortOrder: number;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: ProductStatus;
  diamond: Diamond | null;
  images: AdminImage[];
  variant: {
    id: string;
    sku: string;
    pricePaise: number;
    mrpPaise: number | null;
    stockQuantity: number;
    active: boolean;
  };
  /** true once it has been in a paid order (can't be deleted, only archived) */
  everOrdered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductRequest {
  name: string;
  /** Optional; the backend makes one from the name when empty */
  slug?: string;
  description: string;
  status: ProductStatus;
  sku: string;
  pricePaise: number;
  mrpPaise: number | null;
  stockQuantity: number;
  diamond: DiamondInput;
}

export interface ImportResult {
  rows: number;
  created: number;
  updated: number;
  /** Row numbers start at 2 (row 1 is the header) */
  errors: { row: number; field: string; message: string }[];
  dryRun: boolean;
}

export interface AdminSummary {
  ordersToShip: number;
  awaitingPayment: number;
  paidToday: { count: number; totalPaise: number };
  last30Days: { count: number; totalPaise: number };
  activeDiamonds: number;
  soldLast30Days: number;
  openReturns: number;
  newEnquiries: number;
}

export interface AdminOrderSummary {
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  totalPaise: number;
  createdAt: string;
  paidAt: string | null;
}

export interface AdminOrder extends Order {
  customer: { id: string; fullName: string; email: string; phone: string | null };
  payment: { razorpayOrderId: string | null; razorpayPaymentId: string | null; method: string | null; paidAt: string | null } | null;
  history: { status: OrderStatus; at: string; by: string | null; note: string | null }[];
  notes: { at: string; by: string; text: string }[];
}

/** Packing list: what to pick, where it goes. No prices. */
export interface PackingOrder {
  orderNumber: string;
  paidAt: string;
  shipTo: { fullName: string; city: string; state: string; pincode: string };
  items: { sku: string; productName: string; description: string | null; imageUrl: string | null; certificateNumber: string | null }[];
}

export interface ShipRequest {
  courier: string;
  trackingNumber: string;
  trackingUrl?: string;
}

export interface AdminCustomerSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  orderCount: number;
  totalSpentPaise: number;
}

export interface AdminCustomer extends AdminCustomerSummary {
  addresses: Order["shippingAddress"][];
  orders: AdminOrderSummary[];
}

export interface AdminReturn {
  id: string;
  returnNumber: string;
  orderNumber: string;
  status: ReturnStatus;
  reason: string;
  details: string;
  requestedAt: string;
  customerName: string;
  customerEmail: string;
  items: Order["items"];
  refundPaise: number | null;
  shipment: Shipment | null;
  history: { status: ReturnStatus; at: string; by: string | null; note: string | null }[];
}

export type CouponType = "PERCENT" | "FLAT";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  /** PERCENT: 1–100. FLAT: paise. */
  value: number;
  minOrderPaise: number;
  /** PERCENT only; null = no cap */
  maxDiscountPaise: number | null;
  startsAt: string;
  endsAt: string | null;
  /** null = unlimited */
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
}

export type CouponRequest = Omit<Coupon, "id" | "usedCount">;

export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "DONE";

export interface AdminEnquiry {
  id: string;
  type: "CONTACT" | "VIEWING" | "DIAMOND_QUESTION";
  status: EnquiryStatus;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  productSlug: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  createdAt: string;
}
