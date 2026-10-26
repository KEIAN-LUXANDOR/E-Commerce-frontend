# Frontend Guide for AI Agents

This is the working map for the Keian Luxandor storefront. Treat source code and
the API contract as authoritative when they differ from older setup notes.

## Project at a Glance

- Next.js 16.4.2 App Router, React 19, TypeScript strict mode, Tailwind CSS 4.
- The frontend talks to a Spring Boot REST backend; it does not connect directly
  to PostgreSQL.
- API contracts and local startup instructions are in [`api.md`](./api.md) and
  [`../SETUP.md`](../SETUP.md).
- Architecture, integrations, testing, and concerns are described in
  [`codebase/`](./codebase/).

## Start and Validate

Run from the frontend workspace:

```powershell
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

Do not run a second development server on the same project while one is already
using its `.next` directory. For backend-backed pages, configure `API_URL` and
`NEXT_PUBLIC_USE_MOCK_API=false`; see `SETUP.md`.

## Active Route Map

| Route | Source |
|---|---|
| Home | `src/app/page.tsx` |
| Diamond listing and filters | `src/app/diamonds/[[...type]]/page.tsx` |
| Diamond detail | `src/app/diamond/[slug]/page.tsx` |
| Search | `src/app/search/page.tsx` |
| Cart | `src/app/cart/page.tsx` → `src/components/checkout/CartView.tsx` |
| Checkout | `src/app/checkout/page.tsx` → `src/components/checkout/CheckoutFlow.tsx` |
| Compare | `src/app/compare/page.tsx` → `src/components/catalog/CompareView.tsx` |
| Wishlist | `src/app/wishlist/page.tsx` → `src/components/catalog/WishlistView.tsx` |
| Account and auth | `src/app/account/`, `src/app/(auth)/` |
| Admin | `src/app/admin/` |
| Education and policies | `src/app/education/`, plus root-level policy pages in `src/app/` |

Compatibility routes: `/shop/*` redirects to `/diamonds`; `/product/{slug}`
redirects to `/diamond/{slug}`. An old diamond route group was removed because
it overlapped with the current optional catch-all listing route.

## Source Tree and Responsibilities

```text
src/
  app/             Route pages, layouts, metadata, error states
  components/
    account/       Account profile, address, and order UI
    admin/         Admin screens and forms
    auth/          Login, register, password and verification forms
    catalog/       Product listing, filters, compare, wishlist
    checkout/      Cart and checkout flow
    common/        Empty states, page layout, and shared UI
    diamond/       Diamond detail, gallery, buy box, product effects
    home/          Home sections and editorial content
    layout/        Header, footer, navigation, global notices
    orders/        Order history and payment UI
    product/       Product image and buying actions
    store/, shop/  Older implementation retained for reference/compatibility
  config/          Backend feature switches
  lib/
    api/           API client and endpoint wrappers
    catalog/       Product labels, query parsing, price/display helpers
    payments/      Razorpay browser integration
    shop/          Guest/server cart and wishlist state
    types/         API/domain types
    local-store.ts Browser external-store helpers
    stores.ts      Compare, recently viewed, toast, mini-cart, WhatsApp state
  mocks/           Test and development fixture data
```

Other useful top-level paths: `public/` static media/templates; `scripts/`
local development helper; `docs/` contracts and guides; `mockups/` visual
references; `compose.yaml` local backend database.

## Data and State Flow

1. Route pages parse the URL and call server-side functions in
   `src/lib/api/products.ts`.
2. Those functions use `apiFetch` in `src/lib/api/client.ts`, which builds URLs
   from `API_URL`, converts backend ProblemDetail responses to `ApiError`, and
   handles CSRF for protected browser mutations.
3. `src/lib/types/product.ts` models product, diamond, image, variant, and
   query shapes. Monetary amounts are integer paise.
4. `src/lib/shop/cart.ts` and `wishlist.ts` keep guest state in local storage
   and synchronize account state after login.
5. Shared UI state such as compare, recently viewed, toasts, and the mini-cart
   lives in `src/lib/stores.ts`.

The backend owns stock, final prices, accounts, and persisted cart/order data.
Do not treat browser snapshots as authoritative.

## Feature and Integration Notes

- Backend origin: `API_URL` (default `http://localhost:8080`).
- Browser requests use `/api`; Next rewrites to `/api/v1` when
  `NEXT_PUBLIC_USE_MOCK_API=false`.
- Login uses the backend session cookie; protected browser mutations use CSRF.
- Planned order, payment, returns, coupons, and other endpoints are controlled
  by `src/config/features.ts` and default off.
- WhatsApp destination comes from `NEXT_PUBLIC_WHATSAPP_NUMBER`; if unset, the
  generated link is empty.
- Full endpoint contract: [`api.md`](./api.md).

## Build and Test Notes

Current repair validation: `npm run typecheck` and `npm run build` pass. A
production server returned HTTP 200 for `/`, `/cart`, `/checkout`, `/compare`,
`/wishlist`, `/search?q=oval`, `/diamonds`, `/shop`, and `/product/example`.
The observed `npm test` run had 129 passing and 3 failing tests: one expects a
configured WhatsApp URL; two target old wishlist components that still import
removed store APIs.

`tsconfig.json` intentionally excludes tests and several old storefront files
from the current app typecheck. Keep them out of active routes until migrated to
the current product/store contracts. Vitest still discovers tests under
`src/`.

## Intent Versus Current Implementation

- `SETUP.md` describes `/shop` and `/product` as main routes; they are now
  compatibility redirects to `/diamonds` and `/diamond`.
- `README.md` describes a generic product/category storefront, while the current
  UI and product type include certified diamond-specific details.
- `prompt.md` names `components/store` as a preferred organization, while the
  current active UI is organized mainly under `components/catalog`,
  `components/diamond`, `components/checkout`, and related feature folders.
- The user confirmed that the old `/shop` and `/product` URLs should remain
  redirects. Whether to archive the old component modules remains
  `[ASK USER]`/undecided.

## Evidence

- `package.json`, `tsconfig.json`, `next.config.ts`
- `src/app/`, `src/components/`, `src/lib/`
- `src/lib/api/client.ts`, `src/lib/api/products.ts`
- `src/lib/shop/cart.ts`, `src/lib/shop/wishlist.ts`
- `src/config/features.ts`
- `README.md`, `SETUP.md`, `prompt.md`, `docs/api.md`
