# Merge Conflict Resolution Changes

This file records the merge-corruption fixes made to the root application.
The `azure-deployment` and `vercel-deployment` directories were not changed.

## Files changed

- `package.json`
  - Kept one valid package manifest.
  - Retained the root Next.js 16.4.6 dependency and existing root scripts.
  - Removed the duplicated second manifest that made npm reject `package.json`.

- `package-lock.json`
  - Removed two concatenated lockfile objects and regenerated one valid lockfile.
  - Repaired the optional EMNAPI runtime entry required by the Tailwind WASM dependency graph.

- `next.config.ts`
  - Kept one valid Next.js configuration.
  - Retained localhost as the default API origin.
  - Kept Turbopack root detection using `node_modules/next/package.json`.
  - Retained `/api/*` and `/images/*` rewrites and the `/store` redirect.
  - Disabled Next.js generated `AGENTS.md` output with `agentRules: false`.

- `src/lib/api/config.ts`
  - Removed a duplicated second implementation.
  - Retained `http://localhost:8080` as the default server API origin.

- `src/proxy.ts`
  - Removed the duplicated proxy implementation.
  - Retained the localhost API default for local development.
  - Restored fail-closed behavior: backend HTTP errors and network failures return HTTP 503.
  - Unauthorized customer roles continue to redirect to `/admin/unauthorized`.

- `src/app/error.tsx`
  - Removed the duplicated second React component implementation.

- `src/app/page.tsx`
  - Removed the duplicated second home-page implementation.

- `src/components/home/HeroCarousel.tsx`
  - Removed the duplicated second carousel implementation.

- `src/components/home/HomeSections.tsx`
  - Removed the duplicated second home-sections implementation.

- `src/components/layout/Header.tsx`
  - Removed the duplicated second header implementation.

- `src/components/layout/WhatsAppButton.tsx`
  - Removed the duplicated second WhatsApp button implementation.

## Impact

- The application is now valid TypeScript and Next.js code instead of containing concatenated files.
- Local development uses `http://localhost:8080` unless `API_URL` is set.
- Backend rewrites require `NEXT_PUBLIC_USE_MOCK_API=false`.
- Admin routes remain protected when authorization cannot be verified.
- Deployment-specific copies under `azure-deployment/` and `vercel-deployment/` may still contain their own configurations and were intentionally left untouched.

## Verification

- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test` passes: 16 test files and 42 tests.
- `npm ci --dry-run` passes once lockfile synchronization is completed.
- `npm run dev` starts successfully on port 3000.
- The home page responds with HTTP 200. With no backend process on port 8080, server-side catalogue requests log `ECONNREFUSED` but degrade without stopping Next.js.
