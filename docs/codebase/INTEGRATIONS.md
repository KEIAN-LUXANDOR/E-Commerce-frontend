# External Integrations

## Integration Inventory

| System | Type | Purpose | Auth model | Criticality |
|---|---|---|---|---|
| Spring Boot backend | HTTP REST API | Products, auth, account, address, cart, wishlist, orders | Session cookie; CSRF token for protected browser mutations | High |
| PostgreSQL | Backend data store | Product/account/order persistence for backend | Frontend does not connect directly | High to backend |
| Razorpay Checkout | External payment service | Payment UI after backend order/payment session creation | Backend-created order and server-side signature verification | High, feature-gated |
| WhatsApp | External link | Customer support and diamond enquiries | Public `wa.me` link; configured phone number | Low |

Evidence: `src/lib/api/client.ts`, `src/lib/api/auth.ts`,
`src/lib/api/cart.ts`, `src/lib/api/orders.ts`, `src/lib/payments/razorpay.ts`,
`src/lib/site.ts`, `compose.yaml`.

## Data Stores

| Store | Role | Access layer | Risk |
|---|---|---|---|
| Backend database | Authoritative products and customer/order data | Spring Boot API; PostgreSQL in `compose.yaml` | Frontend depends on backend availability and contract |
| Browser `localStorage` | Guest cart and wishlist snapshots | `src/lib/local-store.ts`, `src/lib/shop/cart.ts`, `wishlist.ts` | Browser storage may be blocked or cleared |
| In-memory stores | Session view, toasts, mini-cart and other transient UI state | `src/lib/local-store.ts`, `src/lib/stores.ts` | State resets on page reload where not persisted |
| Next.js cache | Cached server product reads | `src/lib/api/products.ts` | Staleness is bounded by configured cache life/tags |

## Credentials and Configuration

- `API_URL` is server-side and defaults to `http://localhost:8080`.
- Browser calls use `/api`; `next.config.ts` rewrites to the backend only when
  `NEXT_PUBLIC_USE_MOCK_API` is exactly `"false"`.
- Session cookies are included in requests. The browser API wrapper obtains a
  CSRF token and retries once after a CSRF failure.
- Public configuration includes `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_WHATSAPP_NUMBER`, and `NEXT_PUBLIC_FEATURES`.
- No environment template file is present; `SETUP.md` documents local values.
- No credential values from `.env.local` are included here.

## Reliability and Observability

- The API wrapper performs one CSRF refresh/retry; there is no general retry or
  backoff policy evidenced for API calls.
- `getProducts` and `getProduct` cache successful reads for minutes and use a
  short cache life after failures. Catalog UI displays an unavailable state.
- `[TODO]` A request timeout policy, centralized telemetry, and distributed
  tracing configuration were not found.
- Scan found no CI/CD, security scanner, or monitoring configuration.

## Evidence

- `next.config.ts`
- `src/lib/api/config.ts`
- `src/lib/api/client.ts`
- `src/lib/api/products.ts`
- `src/lib/api/auth.ts`
- `src/lib/api/cart.ts`
- `src/lib/api/orders.ts`
- `src/lib/payments/razorpay.ts`
- `src/lib/site.ts`
- `src/config/features.ts`
- `SETUP.md`
- `compose.yaml`
