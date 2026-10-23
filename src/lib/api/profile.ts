import { apiFetch } from "@/lib/api/client";
import type { User } from "@/lib/types/auth";

export interface UpdateProfileRequest {
  fullName: string;
  phone: string | null;
}

export function updateProfile(body: UpdateProfileRequest) {
  return apiFetch<User>("/account/profile", { method: "PUT", body });
}
