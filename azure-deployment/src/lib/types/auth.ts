export type UserRole = "CUSTOMER" | "ADMIN" | "OWNER" | "PACKER" | "MANAGER";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export type User = AuthUser;

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CsrfTokenResponse {
  headerName: string;
  token: string;
}

export interface MessageResponse {
  message: string;
}

/**
 * Two-level access helper:
 * - Level 1: Customer ("CUSTOMER")
 * - Level 2: Owner / Admin ("ADMIN" or "OWNER")
 */
export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "OWNER";
}