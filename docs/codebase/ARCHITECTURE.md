# Architecture

## Architectural Style

The frontend is a feature-organized Next.js App Router application with a small
HTTP data-access layer. Server Components load public catalog data; Client
Components handle user interaction, session-aware actions, and browser state.
This is not a separate backend or a frontend with direct database access.

Constraints shaping the design:

1. The backend is the source of truth for product availability, account data,
   cart totals, and orders.
2. Browser-only guest state is kept locally and merged/synchronized after login.
3. Money is represented as integer paise in API/domain types and formatted for
   display at the UI edge.

Evidence: `src/lib/types/product.ts`, `src/lib/api/products.ts`,
`src/lib/shop/cart.ts`, `src/lib/api/client.ts`.

## System Flow

```text
URL / App Router
  -> route page or layout
  -> feature component
  -> server catalog helper or browser API/store helper
  -> Spring Boot API (/api/v1)
  -> typed result, empty/unavailable state, or ApiError
  -> rendered page / client state update
```

1. A route such as `src/app/diamonds/[[...type]]/page.tsx` parses path and query
   filters with `src/lib/catalog/query.ts`.
2. The route calls `getProducts` in `src/lib/api/products.ts`.
3. `getProducts` calls `apiFetch` from `src/lib/api/client.ts`; browser
   requests use `/api`, while server requests use `SERVER_API_BASE` derived
   from `API_URL`. The product helper itself is not cached.
4. Responses are rendered through catalog components. Catalog errors are
   represented as an unavailable or invalid-filter state rather than a blank
   successful result.
5. Client actions such as add-to-cart use `src/lib/shop/cart.ts`; guest state is
   local and signed-in state calls account endpoints.

## Responsibilities and Reused Patterns

| Module | Owns | Does not own |
|---|---|---|
| `src/app/` | Route parameters, metadata, server composition | Shared request parsing and cart persistence |
| `src/lib/api/client.ts` | Fetch configuration, CSRF, ProblemDetail parsing, `ApiError` | UI messages/layout |
| `src/lib/api/products.ts` | Cached server catalog reads and failure-state shaping | Client cart/wishlist state |
| `src/lib/shop/cart.ts`, `wishlist.ts` | Guest/server state transitions and synchronization | Backend business rules |
| `src/components/` | Presentation and user events | Direct database access |
| `src/lib/types/` | API/domain contracts | Runtime validation of arbitrary API payloads |

Repeated patterns:

- **API adapter:** `apiFetch` centralizes same-origin browser calls, server API
  calls, CSRF handling, and error conversion.
- **External-store state:** `createLocalStore` and `createMemoryStore` provide
  React subscriptions for local preferences and transient UI state.
- **Feature switches:** `src/config/features.ts` prevents calls to planned
  endpoints until explicitly enabled.
- **Dynamic route streaming:** catalog and search pages place URL-dependent
  server work inside Suspense boundaries, preserving a prerendered shell.

## Known Architectural Risks

- Two generations of storefront code remain. The current route graph uses
  `catalog/`, `diamond/`, and `checkout/`; `tsconfig.json` excludes selected
  legacy `store/` and `shop/` modules.
- Endpoint response types are handwritten. The API layer casts parsed JSON to
  caller-provided types; it does not validate every response at runtime.
- A number of backend-dependent features default off in
  `src/config/features.ts`.
- Home-page new-arrivals data still requires the backend; its helper logs a
  fetch failure and returns an empty list when the backend is unavailable.

## Evidence

- `src/app/diamonds/[[...type]]/page.tsx`
- `src/lib/api/client.ts`
- `src/lib/api/products.ts`
- `src/lib/shop/cart.ts`
- `src/lib/shop/wishlist.ts`
- `src/lib/local-store.ts`
- `src/config/features.ts`
