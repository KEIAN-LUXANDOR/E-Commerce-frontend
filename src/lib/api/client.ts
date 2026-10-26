import { BROWSER_API_BASE, SERVER_API_BASE } from "@/lib/api/config";

/**
 * One fetch wrapper for every call to the Spring Boot API.
 *
 * - Sends the session cookie (credentials: "include").
 * - For POST, PUT, PATCH and DELETE (except the public account actions in docs/api.md) it gets a CSRF token
 *   from GET /auth/csrf and sends it in the X-CSRF-TOKEN header, as docs/api.md requires.
 *   If the backend says the token is missing or old, it fetches a new one and tries once more.
 * - Turns the backend's error body into an ApiError the forms can show.
 *
 * Error body (ProblemDetail, from ApiExceptionHandler and SecurityConfig):
 *   { "status": 400, "title": "Invalid Input", "detail": "One or more fields are invalid.",
 *     "errors": [ { "field": "email", "message": "Enter a valid email address" } ] }
 */

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: { field: string; message: string }[];
}

export class ApiError extends Error {
  constructor(
    /** HTTP status, or 0 when the server couldn't be reached */
    public readonly status: number,
    /** ProblemDetail title, e.g. "Conflict" */
    public readonly title: string,
    /** Message safe to show the shopper (ProblemDetail detail) */
    message: string,
    /** Field name → first message for that field (from the 400 "errors" list) */
    public readonly fieldErrors: Record<string, string> = {},
    /** Optional machine-readable backend error code */
    public readonly code?: string,
    /** The whole error body, for extra fields such as `orderNumber` on PENDING_ORDER_EXISTS */
    public readonly body: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Shown when the backend sends no readable message of its own. */
const FALLBACK_MESSAGES: Record<number, string> = {
  0: "Can’t reach the store right now. Check your internet connection and try again.",
  400: "Some details weren’t accepted. Check the form and try again.",
  401: "Please log in to continue.",
  403: "You don’t have permission to do this.",
  404: "We couldn’t find what you were looking for.",
  409: "This already exists.",
  429: "Too many attempts. Please wait a few minutes and try again.",
};

function fallbackFor(status: number) {
  return FALLBACK_MESSAGES[status] ?? (status >= 500 ? "The store is having trouble right now. Please try again in a moment." : "Something went wrong. Please try again.");
}

/** Reads a ProblemDetail (or any JSON error) into an ApiError. Never throws. */
export async function toApiError(res: Response): Promise<ApiError> {
  let body: ProblemDetail = {};
  try {
    const text = await res.text();
    if (text) body = JSON.parse(text) as ProblemDetail;
  } catch {
    // Not JSON, e.g. a proxy error page
  }
  const fieldErrors: Record<string, string> = {};
  for (const e of Array.isArray(body.errors) ? body.errors : []) {
    if (e?.field && e.message && !fieldErrors[e.field]) fieldErrors[e.field] = e.message;
  }
  const detail = typeof body.detail === "string" && body.detail.trim() ? body.detail : fallbackFor(res.status);
  return new ApiError(res.status, body.title ?? `HTTP ${res.status}`, detail, fieldErrors, body.code, body as Record<string, unknown>);
}

// ---------- CSRF (browser only) ----------

/** Public account endpoints are exempt from CSRF in SecurityConfig and docs/api.md. */
const CSRF_EXEMPT = new Set([
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
]);
let csrf: Promise<{ headerName: string; token: string }> | null = null;

function getCsrfToken() {
  csrf ??= fetch(`${BROWSER_API_BASE}/auth/csrf`, { credentials: "include", headers: { Accept: "application/json" } }).then(async (res) => {
    if (!res.ok) throw await toApiError(res);
    return (await res.json()) as { headerName: string; token: string };
  });
  // A failed request must not be cached
  csrf.catch(() => (csrf = null));
  return csrf;
}

/** Call after login and logout: the backend starts a new session, so the old token stops working. */
export function clearCsrfToken() {
  csrf = null;
}

const isCsrfFailure = (e: ApiError) => e.status === 403 && /csrf/i.test(e.message);

// ---------- requests ----------

export interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Return null instead of throwing on 404 (e.g. a product that doesn't exist). */
  allow404?: boolean;
  /** Return null instead of throwing on 401 (e.g. "who am I" when logged out). */
  allow401?: boolean;
}

const isServer = typeof window === "undefined";

function requestBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (typeof FormData !== "undefined" && body instanceof FormData) return body;
  return JSON.stringify(body);
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, allow404, allow401, headers, ...rest } = options;
  const method = (rest.method ?? "GET").toUpperCase();
  const base = isServer ? SERVER_API_BASE : BROWSER_API_BASE;
  const needsCsrf = !isServer && !["GET", "HEAD", "OPTIONS"].includes(method) && !CSRF_EXEMPT.has(path.split("?")[0]);

  async function send(): Promise<Response> {
    const h = new Headers(headers);
    h.set("Accept", "application/json");
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    // FormData (file uploads): the browser sets the multipart Content-Type itself
    if (body !== undefined && !isForm) h.set("Content-Type", "application/json");
    if (needsCsrf) {
      const t = await getCsrfToken();
      h.set(t.headerName, t.token);
    }
    try {
      return await fetch(`${base}${path}`, {
        ...rest,
        method,
        headers: h,
        credentials: "include",
        body: requestBody(body),
      });
    } catch (e) {
      if ((e as Error).name === "AbortError") throw e;
      throw new ApiError(0, "Network error", fallbackFor(0));
    }
  }

  let res = await send();
  if (!res.ok && needsCsrf && res.status === 403) {
    const err = await toApiError(res.clone());
    if (isCsrfFailure(err)) {
      clearCsrfToken();
      res = await send();
    }
  }

  if (res.status === 404 && allow404) return null as T;
  if (res.status === 401 && allow401) return null as T;
  if (!res.ok) throw await toApiError(res);
  if (res.status === 204 || res.headers.get("Content-Length") === "0") return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
