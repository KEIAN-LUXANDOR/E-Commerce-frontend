# Coding Conventions

## Naming Rules

| Item | Observed rule | Example |
|---|---|---|
| Route files | Next.js file conventions, generally `page.tsx` | `src/app/cart/page.tsx` |
| Feature components | PascalCase in the current implementation; older modules vary | `src/components/checkout/CartView.tsx` |
| Utility modules | kebab-case or domain names | `src/lib/catalog/query.ts` |
| Functions and variables | camelCase | `getProducts`, `refreshCart` |
| Types/interfaces | PascalCase | `Product`, `CartView`, `ApiError` |
| Constants | UPPER_SNAKE_CASE for module constants | `SERVER_API_BASE`, `CSRF_EXEMPT` |
| Environment variables | UPPER_SNAKE_CASE | `API_URL`, `NEXT_PUBLIC_FEATURES` |

## Formatting, Linting, and Type Safety

- Linter: ESLint 9 using `eslint-config-next/core-web-vitals` and
  `eslint-config-next/typescript`, configured in `eslint.config.mjs`.
- Formatter: `[TODO]` No formatter configuration was found.
- TypeScript `strict` is enabled. The current `tsconfig.json` excludes tests and
  several retained legacy storefront modules from the TypeScript program.
- Commands: `npm run lint`, `npm run typecheck`, `npm test`.

## Imports and Modules

- Use `@/` for imports rooted at `src/`; configured in `tsconfig.json` and
  `vitest.config.ts`.
- Feature components import typed helpers from `src/lib/` rather than building
  request URLs independently.
- No universal barrel-export convention is enforced; imports generally point
  directly at a module.
- Server-only API modules use the `server-only` package where appropriate.

## Errors and Logging

- API failures are represented by `ApiError` with HTTP status, title, safe
  message, field errors, optional backend code, and body.
- Client-side form components display returned messages/field errors.
- Catalog server helpers catch failures and return explicit `unavailable` or
  filter-error result states.
- Browser storage access is guarded because it can be unavailable.
- `[TODO]` No shared application logging library or structured logging format
  was found. Avoid logging secrets, session cookies, or payment signatures.

## Testing Conventions

- Vitest tests are named `*.test.ts` or `*.test.tsx`, usually next to source or
  inside `__tests__/`.
- The Vitest environment is `node`; component tests use React server rendering
  in some suites.
- Tests are excluded from `tsc` via `tsconfig.json`; Vitest remains the test
  runner.
- `[TODO]` No coverage threshold or coverage command is configured.

## Evidence

- `tsconfig.json`
- `eslint.config.mjs`
- `vitest.config.ts`
- `package.json`
- `src/lib/api/client.ts`
- `src/lib/local-store.ts`
- `src/components/catalog/ProductCard.tsx`
