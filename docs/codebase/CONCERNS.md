# Codebase Concerns

## Top Risks

| Severity | Concern | Impact | Suggested action |
|---|---|---|---|
| High | Old and current storefront implementations coexist. `src/components/store/` and `src/components/shop/` include legacy modules excluded by `tsconfig.json`. | Future imports can reintroduce incompatible product models or missing exports. | `[ASK USER]` Decide whether to archive/remove the old implementation or retain it as a supported compatibility surface. |
| Medium | `npm run lint` remains red (109 errors, 108 warnings in the observed run), while tests, typecheck, and production build pass. | Unrelated lint debt obscures future regressions. | Triage lint errors in a separate, scoped cleanup. |
| High | Many frontend API contracts have no matching backend controller: planned admin, payment, invoice, returns, tracking, newsletter, enquiry, banners, featured products, and delivery PIN APIs. | These operations cannot work against the inspected backend. | Keep these paths gated or use only existing routes. |
| Medium | Public `GET /actuator/health` is configured with `management.endpoint.health.show-details=always`. | Health responses expose component details to unauthenticated callers. | Hide details on the public endpoint or protect a separate detailed health endpoint. |
| Medium | Payment, tracking, invoice, return, coupon, and admin API operations are feature-gated off by default; core order endpoints are implemented. | Optional workflows remain unavailable until backend contracts are implemented. | Keep unsupported switches off. |
| High | Backend did not respond on port 8080 during the current check; PostgreSQL accepted connections on port 5433. | Frontend API calls fail until Spring Boot is running. | Start the backend and inspect its startup logs; the port probe alone cannot establish why it stopped. |
| Low | No CI/CD or automated security/monitoring configuration was detected. | Build/test checks may not run automatically; runtime issues have limited telemetry. | `[ASK USER]` Confirm whether CI and production observability are in scope. |

## Technical Debt

| Debt | Evidence | Risk | Suggested fix |
|---|---|---|---|
| Legacy store and shop components use removed store exports and old product types | `src/components/store/`, `src/components/shop/`, `src/lib/stores.ts`, `tsconfig.json` | Reintroducing files into current routes causes type/build failures | Consolidate around `src/lib/shop/` and current `Product` type, or explicitly archive the old modules |
| Optional API work is planned and feature-gated | `src/config/features.ts`, `src/lib/api/orders.ts` | Optional UI may be unavailable until backend contracts exist | Track endpoint readiness and test each enabled feature |
| Setup route descriptions are stale | `SETUP.md`, current `src/app/` | Incorrect onboarding and route assumptions | Keep setup docs aligned with the active route graph |

## Security and Performance Notes

- Positive controls evidenced: session cookies are included; protected browser
  mutations use CSRF; public and protected account endpoints are separated in
  `src/lib/api/client.ts` and `src/lib/api/auth.ts`.
- No repository-level security scanner/policy was found by the scan. This is
  not a security audit; production security review remains `[TODO]`.
- Browser local state is best-effort and not authoritative; server cart prices
  and availability are refreshed before checkout (`src/lib/shop/cart.ts`).
- Catalog reads are cached (`src/lib/api/products.ts`). `[TODO]` Confirm the
  desired freshness and invalidation policy with backend/admin workflows.
- `src/components/home/HomeSections.tsx` and legacy store components are large
  files, increasing review and maintenance effort.

## Fragility and Churn

The scan observed only two recent commits, so its high-churn ranking is not a
strong statistical signal. It listed the cart, checkout, search, root layout,
account, and admin-shell paths among the most changed files.

## `[ASK USER]` Questions

1. Should old `store/` and `shop/` modules be removed/archived after migration,
   or are they still a required compatibility surface?
2. Is adding CI/CD and production observability in scope for this frontend?

## Evidence

- `tsconfig.json`
- `src/lib/stores.ts`
- `src/lib/shop/cart.ts`
- `src/lib/shop/wishlist.ts`
- `src/config/features.ts`
- `docs/API-ENDPOINTS.md`
- `../backend/backend/src/main/java/com/keianluxandor/backend`
- `../backend/backend/src/main/resources/application.properties`
- `src/lib/site.ts`
- `SETUP.md`
- `src/app/(shop)/shop/[[...category]]/page.tsx`
- `src/app/(shop)/product/[slug]/page.tsx`
- `package.json`
- `vitest.config.mts`
- `next.config.ts`
- `compose.yaml`
