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

`vitest.config.mts` includes `src/**/*.{test,spec}.{ts,tsx}` and uses the `node`
environment. Tests are colocated with library modules or placed in `__tests__`
folders, including:

- `src/lib/*.test.ts`
- `src/lib/api/*.test.ts`
- `src/components/account/__tests__/`
- `src/components/admin/__tests__/`
- `src/components/checkout/__tests__/`
- `src/components/layout/__tests__/`
- `src/components/ui/primitives.test.tsx`
- `src/lib/catalog/__tests__/`

## Scope and Isolation

| Scope | Present | Notes |
|---|---|---|
| Unit | Yes | Query, auth, and API helper tests |
| Component | Yes | Account, admin, checkout, layout, and storefront tests |
| Integration with a live backend | `[TODO]` | No live-service test configuration was found |
| End-to-end browser tests | No configured runner found | `[TODO]` Decide whether E2E coverage is required |

`vitest.config.mts` defines a `@` alias to `src/`. Test files are excluded from
the TypeScript typecheck; Vitest executes them separately.

## Current Validation Snapshot

The latest production-readiness pass observed:

- `npm run typecheck`: passed.
- `npm test`: 13 test files and 31 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated the current route graph.

Rerun these commands after changes; this snapshot is not a continuous CI check.

## Evidence

- `package.json`
- `vitest.config.mts`
- `tsconfig.json`
- `src/lib/api/account-endpoints.test.ts`
- `src/components/layout/__tests__/layout.test.tsx`
- `src/components/store/__tests__/parity.test.tsx`
- `src/components/store/__tests__/catalog.test.tsx`
