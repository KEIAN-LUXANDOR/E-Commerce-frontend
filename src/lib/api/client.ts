// src/lib/api/client.ts

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  title?: string;
  detail?: string;
  code?: string;
  errors?: FieldError[];

  constructor(data: any) {
    super(data.detail || data.title || "An unexpected error occurred");
    this.status = data.status || 500;
    this.title = data.title;
    this.detail = data.detail;
    this.code = data.code;
    this.errors = data.errors;
  }
}

let csrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (typeof window === "undefined") return ""; // Skip during SSR
  const res = await fetch("/api/v1/auth/csrf", { credentials: "include" });
  if (res.ok) {
    const data = await res.json();
    csrfToken = data.token;
    return csrfToken!;
  }
  return "";
}

export function clearCsrfToken() {
  csrfToken = null;
}

const NO_CSRF_PATHS = [
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const isNoCsrfPath = NO_CSRF_PATHS.some((p) => path.includes(p));

  if (method !== "GET" && !isNoCsrfPath) {
    if (!csrfToken) {
      await getCsrfToken();
    }
    if (csrfToken) {
      headers.set("X-CSRF-TOKEN", csrfToken);
    }
  }

  // Fix: Node.js requires absolute URLs for Server-Side Rendering
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? (process.env.API_URL || "http://localhost:8080") : "";
  const url = path.startsWith("http") ? path : `${baseUrl}/api/v1${path}`;

  let res = await fetch(url, { ...options, method, headers, credentials: "include" });

  // Retry once if CSRF token is expired/missing
  if (res.status === 403 && method !== "GET" && !isNoCsrfPath) {
    const errBody = await res.clone().json().catch(() => ({}));
    if (errBody.detail?.toLowerCase().includes("csrf")) {
      await getCsrfToken();
      if (csrfToken) headers.set("X-CSRF-TOKEN", csrfToken);
      res = await fetch(url, { ...options, method, headers, credentials: "include" });
    }
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  let body;
  try {
    body = await res.json();
  } catch (e) {
    body = {};
  }

  if (!res.ok) {
    throw new ApiError({ status: res.status, ...body });
  }

  return body as T;
}