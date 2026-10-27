# Project repair log

## Scope and plan

This log records repair work performed for the project-repair request. The
worktree already contained changes before this work began; unrelated existing
changes were preserved. The plan was to inspect the route/API contracts, repair
the current product and checkout flows, remove tightly coupled duplication,
verify tests/build, then correct the codebase overview. Compare was excluded.

## Changes made

- Unified API request/error handling for JSON bodies, configured browser/server
  API bases, 404 handling, CSRF, and backend validation details. Aligned auth,
  profile, address, account, product, and order helpers; removed duplicate
  account profile implementations and replaced fake order-success responses
  with feature-gated API calls.
- Corrected mock-API configuration drift; repaired typed product cards, PDP
  data/related products, certificate display, INR formatting, compatibility
  re-exports, and wishlist button reuse.
- Improved checkout address typing and surfaced eligibility, address, resend,
  and order errors. Fixed account-order props and admin inventory imports.
- Added Suspense fallbacks for dynamic catalog/search URL data and removed
  `usePathname()` from the shared header, closing the mobile menu on navigation
  links and browser history changes.
- Typed natural-language search filters and removed unnecessary `any` casts
  from pagination.
- Removed duplicate Vitest configuration; `vitest.config.mts` is the canonical
  config selected by `npm test`. Updated the related test files.
- Updated the seven `docs/codebase/` overviews to reflect actual routes,
  configuration, test/build status, and backend feature gates.

## Verification

- `npm run typecheck`: passed.
- `npm test`: 14 files, 40 tests passed.
- `npm run build`: passed; Next.js generated the current route graph.
- Focused ESLint on repaired route/search/API files: passed.
- `npm run lint`: still fails repository-wide with 109 errors and 108 warnings
  in the observed run; the remaining lint backlog is outside the focused repair.

## Known limitations

- The compare feature was intentionally not changed.
- The current route tree has no `/compare` page. The active PDP is
  `/diamond/[slug]`, not the nested route claimed by `plan-001.md`.
- Several order/payment/admin functions remain unavailable by default behind
  `src/config/features.ts`; backend contracts and live integration were not
  available to verify those flows end to end.
- When the local backend is unavailable, the home-page new-arrivals request
  logs the failure and renders an empty list; the production build still
  completes.
- The pre-existing `.next.rar` archive was inspected but left untouched.

No commit or push was performed.

## Admin functionality follow-up

- Restored API-backed product inventory, create/edit, and CSV import flows;
  added packing verification and order, return, customer, coupon, and enquiry
  management screens. Unsupported staff, audit, vault, category, and settings
  mutations no longer report fake success.
- Connected account order details, payment, tracking, return requests, and
  newsletter signup to typed APIs. These paths remain unavailable when their
  feature switches are off.
- Corrected admin navigation targets and placed dynamic admin detail params
  behind Suspense for Next.js Cache Components.
- Coupon updates now send only request fields; product form values derive from
  loaded data without synchronously setting state in an effect.

Validation after this follow-up:

- `npm test`: 14 test files and 40 tests passed.
- Focused ESLint on changed admin screens/components/tests: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed and emitted the current route graph. The home-page
  new-arrivals fetch logs a prerender-cancellation warning; it does not prove
  that the backend is unavailable.

## Backend parity check

- The backend test suite passed in an earlier run, but on the latest check the
  Spring Boot port 8080 was not listening; PostgreSQL on port 5433 was reachable.
- `.env.local` correctly selects the live API (`NEXT_PUBLIC_USE_MOCK_API=false`,
  `API_URL=http://localhost:8080`).
- Compared frontend API contracts with backend controllers and recorded
  missing public/customer/admin API routes in `docs/API-ENDPOINTS.md`.
- The public health endpoint currently exposes component details because
  `management.endpoint.health.show-details=always`; backend config should hide
  those details before deployment.

## Frontend alignment to implemented backend

- Enabled core order operations, implemented account order history using the
  backend's full-order page response, and linked checkout to the created order.
- Removed invented payment-success messaging. Order status now shows the real
  pending payment state; payment remains disabled because its endpoint is absent.
- Replaced the unsupported similar-products endpoint with supported product
  search by origin and shape. Product detail now reports catalogue failures
  instead of throwing an opaque server error.

## Visible account and shopping actions

- Tightened the login layout so its submit action stays visible, and made
  verification-email resend available after entering an email.
- Registration now directs new users to verify their email before signing in,
  with visible resend and sign-in actions.
- Product cards show a labeled Add to Cart button or a disabled Sold Out
  button; the home hero now labels its catalog action "Shop now".
- Kept cart state and mini-cart actions typed while wiring the visible CTA.

Validation:

- `npm test`: 15 files and 41 tests passed.
- `npm run typecheck`: passed.
- Focused ESLint on changed UI/cart files: passed.
- `npm run build`: passed; homepage new-arrivals prerender logged a fetch
  cancellation warning.
- Repository-wide `npm run lint` remains blocked by pre-existing warnings in
  other files; the changed UI/cart files pass focused lint.
- No backend files were changed.
