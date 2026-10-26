# Testing Patterns

## Test Stack and Commands

- Primary framework: Vitest 5.0.5.
- Assertions: Vitest's `expect`; component tests use React DOM server rendering.
- Run all tests: `npm test`.
- Typecheck: `npm run typecheck`.
- Lint: `npm run lint`.
- Production build: `npm run build`.
- `[TODO]` No coverage command or coverage threshold is configured.

## Test Layout

`vitest.config.ts` includes `src/**/*.{test,spec}.{ts,tsx}` and uses the `node`
environment. Tests are colocated with library modules or placed in `__tests__`
folders, including:

- `src/lib/*.test.ts`
- `src/lib/api/*.test.ts`
- `src/components/account/__tests__/`
- `src/components/admin/__tests__/`
- `src/components/checkout/__tests__/`
- `src/components/layout/__tests__/`
- `src/components/store/__tests__/`

## Scope and Isolation

| Scope | Present | Notes |
|---|---|---|
| Unit | Yes | Query, auth, and API helper tests |
| Component | Yes | Account, admin, checkout, layout, and storefront tests |
| Integration with a live backend | `[TODO]` | No live-service test configuration was found |
| End-to-end browser tests | No configured runner found | `[TODO]` Decide whether E2E coverage is required |

`vitest.config.ts` defines a `@` alias to `src/`. Test files are excluded from
the TypeScript typecheck; Vitest executes them separately.

## Current Validation Snapshot

Observed during this repair:

- `npm run typecheck`: passed.
- `npm run build`: passed and generated all routes.
- `npm run lint` on the changed active files: passed.
- `npm test`: 129 passed, 3 failed (132 total). Failures were one WhatsApp link
  assertion with no configured WhatsApp number and two tests rendering legacy
  wishlist components that still expect removed `useWishlist` behavior.

The test snapshot is time-specific; rerun the commands before relying on it.

## Evidence

- `package.json`
- `vitest.config.ts`
- `tsconfig.json`
- `src/lib/api/account-endpoints.test.ts`
- `src/components/layout/__tests__/layout.test.tsx`
- `src/components/store/__tests__/parity.test.tsx`
- `src/components/store/__tests__/catalog.test.tsx`
