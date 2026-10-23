/**
 * Where data comes from.
 *
 * NEXT_PUBLIC_USE_MOCK_API=true  → sample data in src/mocks (default until the backend is ready)
 * NEXT_PUBLIC_USE_MOCK_API=false → the Spring Boot API at API_URL
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

/** Server-side base URL of the Spring Boot API, e.g. http://localhost:8080 (never exposed to the browser). */
export const API_URL = process.env.API_URL ?? "http://localhost:8080";

/** Base path for server-side requests to the Spring Boot API. */
export const SERVER_API_BASE = `${API_URL.replace(/\/+$/, "")}/api/v1`;

/**
 * Base path the BROWSER calls. Real calls go to /api/... on our own domain and are
 * forwarded to Spring Boot's /api/v1/... routes by the rewrite in next.config.ts.
 */
export const BROWSER_API_BASE = USE_MOCK ? "/api/mock" : "/api";
