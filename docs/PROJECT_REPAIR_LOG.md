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
