import { apiFetch } from "@/lib/api/client";
import type { MessageResponse, User } from "@/lib/types/auth";

export interface UpdateProfileRequest {
  fullName: string;
  phone: string | null;
}

export function updateProfile(body: UpdateProfileRequest) {
  return apiFetch<User>("/account/profile", { method: "PUT", body });
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export function changePassword(body: ChangePasswordRequest) {
  return apiFetch<MessageResponse>("/account/change-password", { method: "POST", body });
}
