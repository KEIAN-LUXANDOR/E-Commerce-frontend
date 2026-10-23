/** Matches UserResponse in the backend (docs/api.md, Auth section). */
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  emailVerified: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  /** 10-digit Indian mobile number, optional */
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
