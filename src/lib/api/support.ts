import { apiFetch, ApiError } from "@/lib/api/client";
import type { MessageResponse } from "@/lib/api/auth";
import { requireFeature } from "@/config/features";

export type EnquiryType = "CONTACT" | "VIEWING" | "DIAMOND_QUESTION";

export interface EnquiryRequest {
  type: EnquiryType;
  fullName: string;
  email: string;
  /** 10-digit Indian mobile */
  phone: string;
  message: string;
  /** For DIAMOND_QUESTION and VIEWING of a particular stone */
  productSlug?: string;
  /** For VIEWING: "2026-11-02" */
  preferredDate?: string;
  /** For VIEWING: "MORNING" | "AFTERNOON" | "EVENING" */
  preferredTime?: "MORNING" | "AFTERNOON" | "EVENING";
}

/** 201 { message }. 400 field errors. 429 too many messages. */
export async function sendEnquiry(body: EnquiryRequest): Promise<MessageResponse> {
  requireFeature("enquiries");
  return apiFetch<MessageResponse>("/enquiries", { method: "POST", body });
}

/** 202 { message } always (never reveals whether the email was already subscribed). */
export async function subscribeNewsletter(email: string): Promise<MessageResponse> {
  requireFeature("newsletter");
  return apiFetch<MessageResponse>("/newsletter", { method: "POST", body: { email } });
}

export interface PincodeResult {
  pincode: string;
  countryCode?: string;
  serviceable: boolean;
  city: string | null;
  state: string | null;
  /** Working days for delivery after dispatch. */
  minDays: number | null;
  maxDays: number | null;
}

/**
 * Uses the existing delivery serviceability endpoint. The countryCode query
 * disambiguates postal-code formats that are not globally unique.
 * The older /pincodes alias remains as a compatibility fallback.
 */
export async function checkPincode(
  pincode: string,
  countryCode = "IN",
): Promise<PincodeResult> {
  requireFeature("pincodeCheck");
  const postalCode = pincode.trim().toUpperCase();
  const market = countryCode.trim().toUpperCase();
  const query = `?countryCode=${encodeURIComponent(market)}`;
  const primaryPath = `/delivery/pincode/${encodeURIComponent(postalCode)}${query}`;
  const legacyPath = `/pincodes/${encodeURIComponent(postalCode)}${query}`;

  try {
    return await apiFetch<PincodeResult>(primaryPath);
  } catch (error) {
    // Only fall back for a missing legacy route. Do not turn network/server
    // failures into a fake "serviceable" result.
    if (!(error instanceof ApiError) || error.status !== 404) throw error;
    return apiFetch<PincodeResult>(legacyPath);
  }
}
