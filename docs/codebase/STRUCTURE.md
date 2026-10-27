# Codebase Structure

## Top-Level Map

| Path | Purpose |
|---|---|
| `src/app/` | Next.js App Router pages, layouts, route-level error/not-found UI |
| `src/components/` | Feature and shared UI components |
| `src/lib/api/` | HTTP wrappers for backend endpoints |
| `src/lib/catalog/` | Product labels, query parsing, and product helpers |
| `src/lib/shop/` | Browser cart/wishlist state synchronized with account APIs |
| `src/lib/types/` | Frontend API and domain types |
| `src/config/` | Feature switches |
| `src/mocks/` | Development/test catalog fixtures and adapters |
| `public/` | Static images, icons, and import templates |
| `scripts/` | Local development API helper |
| `docs/` | API/setup documentation and this codebase map |
| `mockups/` | Design references |
| `compose.yaml` | Local PostgreSQL service used by the backend |

## Entry Points

- Development: `npm run dev` → Next.js.
- Production build: `npm run build` → Next.js build.
- Production serving: `npm run start` → Next.js start.
- Application root: `src/app/layout.tsx`; homepage: `src/app/page.tsx`.
- There are no separate frontend worker or CLI entry points in `package.json`.

## Route Map

Routes present in `src/app/` include:

- Storefront: `/`, `/diamonds/[[...type]]`, `/diamond/[slug]`, `/search`,
  `/cart`, `/checkout`, `/checkout/success`, `/wishlist`.
- Account: `/account`, `/account/addresses`, `/account/orders`,
  `/account/orders/[orderNumber]`, `/account/vault`.
- Authentication: `/login`, `/register`, `/verify-email`,
  `/forgot-password`, `/reset-password`.
- Administration: `/admin` and the pages under `src/app/admin/`.
- Editorial and service: `/education/*`, `/about`, `/contact`, `/faq`,
  `/shipping`, `/returns`, `/privacy`, `/terms`, `/order-tracking`.
- Compatibility routes: `/shop/*` redirects to `/diamonds`; `/product/[slug]`
  redirects to `/diamond/[slug]`.

There is no `/compare` page in the current route tree; compare remains out of
scope. The plan's `/(shop)/diamonds/[type]/[slug]` route does not exist: the
active PDP is `/diamond/[slug]`. `next build` successfully generated the
current route graph during this repair.

The route table above is corroborated by `src/app/` and the successful
`next build` route report.

## Module Boundaries

| Boundary | Responsibility |
|---|---|
| `src/app/` | Route composition, metadata, server data access, and navigation |
| `src/components/catalog/`, `diamond/`, `checkout/`, `account/`, `admin/` | Feature-specific presentation and interaction |
| `src/lib/api/` | Request serialization, authentication/CSRF handling, API calls |
| `src/lib/shop/` | Browser-side cart and wishlist state; delegates persistence to API/local stores |
| `src/lib/types/` | Shared product, order, user, and address contracts |
| `src/lib/site.ts`, `src/config/` | Store details and feature/environment configuration |

Avoid putting UI state, formatting, or route rendering into API wrapper modules.
Evidence: `src/app/diamonds/[[...type]]/page.tsx`,
`src/lib/api/products.ts`, `src/lib/api/client.ts`,
`src/lib/shop/cart.ts`.

## Naming and Organization

- Routes and most feature files use kebab-case or descriptive mixed-case names.
- React component modules commonly use PascalCase (`ProductGrid.tsx`,
  `CartView.tsx`); older files remain in lower-case/kebab-case.
- TypeScript path alias `@/*` maps to `src/*`.
- Current features are organized by domain. Legacy `src/components/store/` and
  `src/components/shop/` modules coexist with the current `catalog/`,
  `diamond/`, and `product/` modules.

## Evidence

- `src/app/`
- `src/components/`
- `src/lib/`
- `src/config/features.ts`
- `tsconfig.json`
- `next.config.ts`
