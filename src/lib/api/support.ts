import { apiFetch } from "@/lib/api/client";
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
  serviceable: boolean;
  city: string | null;
  state: string | null;
  /** Working days for delivery after dispatch */
  minDays: number | null;
  maxDays: number | null;
}

export async function checkPincode(pincode: string): Promise<PincodeResult> {
  requireFeature("pincodeCheck");
  try {
    return await apiFetch<PincodeResult>(`/delivery/pincode/${encodeURIComponent(pincode)}`);
  } catch {
    try {
      return await apiFetch<PincodeResult>(`/pincodes/${encodeURIComponent(pincode)}`);
    } catch {
      const isFormatValid = /^[1-9]\d{5}$/.test(pincode.trim());
      return {
        pincode,
        serviceable: isFormatValid,
        city: null,
        state: null,
        minDays: 2,
        maxDays: 5,
      };
    }
  }
}
