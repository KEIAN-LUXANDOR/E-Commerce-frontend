/** Versioned server-side API base URL (never exposed to the browser). */
export const API_URL = process.env.API_URL ?? "https://api.keianluxlandor.in/api/v1";

/** Base path for server-side requests to the Spring Boot API. */
export const SERVER_API_BASE = API_URL.replace(/\/+$/, "");

/**
 * Base path the BROWSER calls. Calls go to /api/... on our own domain and are
 * forwarded to Spring Boot's API_URL/... routes by the rewrite in next.config.ts,
 * so the session cookie stays first-party.
 */
export const BROWSER_API_BASE = "/api";
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
