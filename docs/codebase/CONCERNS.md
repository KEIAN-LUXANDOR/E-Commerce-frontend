# Codebase Concerns

## Top Risks

| Severity | Concern | Impact | Suggested action |
|---|---|---|---|
| High | Old and current storefront implementations coexist. `src/components/store/` and `src/components/shop/` contain stale store APIs; `tsconfig.json` excludes them, and legacy route pages now redirect. | Future imports can reintroduce missing exports, incompatible product models, or route conflicts. | `[ASK USER]` Decide whether to archive/remove the old implementation or keep it as a supported compatibility surface. |
| Medium | Three of 132 Vitest tests fail in the observed run. The two storefront failures reference old `useWishlist` exports; the WhatsApp link assertion requires configuration. | Test suite is not fully green; regressions in current routes could be obscured by stale tests. | Update/retire legacy tests against the active components and configure the WhatsApp number in test setup. |
| Low | Old component modules remain in the repository after their routes were migrated. The user confirmed legacy URL redirects should remain. | The old component compatibility intent is not yet known. | `[ASK USER]` Decide whether to archive them or keep them supported; setup route docs now reflect redirects. |
| Medium | Company-specific details and planned features are incomplete or disabled by default. | Contact links may be empty; checkout/payment/order features may be unavailable. | Confirm company details and enable each feature only after its backend endpoint is ready. |
| Low | No CI/CD or automated security/monitoring configuration was detected. | Build/test checks may not run automatically on changes; runtime issues have limited telemetry. | `[ASK USER]` Confirm whether CI and production observability are expected for this repository. |

## Technical Debt

| Debt | Evidence | Risk | Suggested fix |
|---|---|---|---|
| Legacy store and shop components use removed store exports and old product types | `src/components/store/`, `src/components/shop/`, `src/lib/stores.ts`, `tsconfig.json` | Reintroducing files into current routes causes type/build failures | Consolidate around `src/lib/shop/` and current `Product` type, or explicitly archive the old modules |
| Feature/API work is partly planned and feature-gated | `src/config/features.ts`, `src/lib/api/orders.ts` | UI may be present but backend operation is disabled | Track endpoint readiness and test each enabled feature |
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
account, and admin-shell paths among the most changed files. These areas should
be changed with focused tests and route-level verification.

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
- `src/lib/site.ts`
- `SETUP.md`
- `src/app/(shop)/shop/[[...category]]/page.tsx`
- `src/app/(shop)/product/[slug]/page.tsx`
- `src/components/layout/__tests__/layout.test.tsx`
- `src/components/store/__tests__/parity.test.tsx`
- `src/components/store/__tests__/catalog.test.tsx`
- `compose.yaml`
