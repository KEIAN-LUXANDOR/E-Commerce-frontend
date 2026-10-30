// src/lib/api/client.ts

import { BROWSER_API_BASE, SERVER_API_BASE } from "./config";

export interface FieldError {
  field: string;
  message: string;
}

interface ProblemDetail {
  status?: number;
  title?: string;
  detail?: string;
  code?: string;
  errors?: FieldError[];
}

export class ApiError extends Error {
  status: number;
  title?: string;
  detail?: string;
  code?: string;
  errors?: FieldError[];
  fieldErrors: Record<string, string>;

  constructor(data: ProblemDetail) {
    super(data.detail || data.title || "An unexpected error occurred");
    this.name = "ApiError";
    this.status = data.status ?? 500;
    this.title = data.title;
    this.detail = data.detail;
    this.code = data.code;
    this.errors = data.errors;
    this.fieldErrors = Object.fromEntries((data.errors ?? []).map(({ field, message }) => [field, message]));
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | object | null;
  allow404?: boolean;
}

let csrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (typeof window === "undefined") return ""; // Skip during SSR
  const res = await fetch(`${BROWSER_API_BASE}/auth/csrf`, { credentials: "include" });
  if (res.ok) {
    const data = await res.json();
    csrfToken = data.token;
    return csrfToken!;
  }
  throw await toApiError(res);
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

function isBodyInit(body: unknown): body is BodyInit {
  if (typeof body === "string") return true;
  if (typeof body !== "object" || body === null) return false;
  return (
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
  );
}

export async function toApiError(response: Response): Promise<ApiError> {
  let problem: ProblemDetail = {};
  try {
    problem = await response.clone().json();
  } catch {
    // Error responses can be empty or non-JSON (for example, a proxy error page).
  }

  let detail = problem.detail || problem.title;
  // Endpoint not built on the backend yet (Spring: unmapped path → 404 "No static resource …", or 405/501).
  // Show a friendly message, and let screens switch to their "coming soon" view (code NOT_AVAILABLE).
  const missingEndpoint =
    response.status === 501 ||
    response.status === 405 ||
    (response.status === 404 && /no static resource|no endpoint|no handler found/i.test(String(problem.detail ?? "")));
  if (missingEndpoint) {
    return new ApiError({
      ...problem,
      status: response.status,
      code: "NOT_AVAILABLE",
      detail: "This isn’t available online yet. Please contact us and we’ll help you straight away.",
    });
  }
  if (!detail && response.status === 429) {
    detail = "Too many attempts. Please wait before trying again.";
  } else if (!detail && response.status >= 500) {
    detail = "We're having trouble right now. Please try again later.";
  }

  return new ApiError({ ...problem, status: response.status, detail });
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);
  const { allow404 = false, ...requestOptions } = options;
  const rawBody = requestOptions.body;
  const isJsonBody = rawBody !== undefined && rawBody !== null &&
    typeof rawBody === "object" && !isBodyInit(rawBody);
  let body: BodyInit | null | undefined;
  if (rawBody === null || rawBody === undefined || isBodyInit(rawBody)) {
    body = rawBody;
  } else {
    body = JSON.stringify(rawBody);
  }

  if ((isJsonBody || typeof rawBody === "string") && !headers.has("Content-Type")) {
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
  const baseUrl = typeof window === "undefined" ? SERVER_API_BASE : BROWSER_API_BASE;
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  let res = await fetch(url, { ...requestOptions, body, method, headers, credentials: "include" });

  // Retry once if CSRF token is expired/missing
  if (res.status === 403 && method !== "GET" && !isNoCsrfPath) {
    const errBody = await res.clone().json().catch(() => ({}));
    if (errBody.detail?.toLowerCase().includes("csrf")) {
      await getCsrfToken();
      if (csrfToken) headers.set("X-CSRF-TOKEN", csrfToken);
      res = await fetch(url, { ...requestOptions, body, method, headers, credentials: "include" });
    }
  }

  if (res.status === 404 && allow404) {
    return null as T;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  try {
    return await res.json() as T;
  } catch {
    throw new ApiError({
      status: res.status,
      detail: "The server returned an unreadable response. Please try again.",
    });
  }
}