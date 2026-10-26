# Technology Stack

## Runtime Summary

| Area | Value | Evidence |
|---|---|---|
| Primary language | TypeScript and TSX | `tsconfig.json`, `src/` |
| Runtime | Node.js 24.21.0 in the validation environment; repository does not pin a version. `[TODO]` Choose and document the supported Node.js version. | `package.json`, `SETUP.md`, validation terminal |
| Package manager | npm 11.19.0 in the validation environment; lockfile version 3. The lockfile records an `e-commerce` root and `diamond-frontend` workspace. | `package.json`, `package-lock.json`, validation terminal |
| Framework | Next.js 16.4.2 App Router, React 19.3.0 | `package.json`, `next.config.ts` |
| Styling | Tailwind CSS 4 with the Next Turbopack loader | `package.json`, `next.config.ts` |
| Module/build system | ES modules, Next.js/Turbopack | `package.json`, `next.config.ts`, `tsconfig.json` |

## Production Dependencies

| Dependency | Version | Role |
|---|---:|---|
| `next` | 16.4.2 | App Router, rendering, routing, caching, and production build |
| `react`, `react-dom` | 19.3.0 | UI runtime |
| `@radix-ui/*` | See `package.json` | Accessible UI primitives |
| `lucide-react` | ^1.59.0 | Icons |
| `framer-motion` | ^14.6.0 | Motion components |
| `canvas-confetti` | ^1.9.4 | Confetti UI effect |
| `server-only` | ^0.0.1 | Prevent server-only modules from entering client bundles |
| `clsx`, `tailwind-merge`, `class-variance-authority` | See `package.json` | Class composition and component variants |
| `@fontsource-variable/*` | See `package.json` | Locally bundled fonts |

The frontend has no ORM or direct database driver. PostgreSQL is started for the
Spring Boot backend through the repository's `compose.yaml`; the browser and
server-rendered pages access data through HTTP APIs. Evidence: `compose.yaml`,
`src/lib/api/client.ts`.

## Development Toolchain

| Tool | Purpose |
|---|---|
| TypeScript ^5 | Strict type checking |
| ESLint 9 and `eslint-config-next` 16.4.2 | Linting |
| Vitest 5.0.5 | Unit/component tests |
| `@tailwindcss/turbopack` ^4 | Tailwind CSS compilation |
| Next.js type generation | `next typegen` before `tsc` |

## Commands

```powershell
npm install
npm run dev
npm run typecheck
npm test
npm run lint
npm run build
npm run start
```

These scripts are defined in `package.json`. Run them from the frontend workspace.

## Environment and Configuration

| Variable | Use | Default / requirement |
|---|---|---|
| `API_URL` | Server API origin and rewrite target | Defaults to `http://localhost:8080`; set for the deployed backend |
| `NEXT_PUBLIC_USE_MOCK_API` | Enables the `/api` and `/images` rewrites when exactly `"false"` | Set to `false` to use the backend |
| `NEXT_PUBLIC_SITE_URL` | Canonical metadata base URL | Defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp link destination, digits with country code | Optional; empty hides the destination |
| `NEXT_PUBLIC_FEATURES` | Enables named planned features, or `all` | Empty means all feature switches remain off |

Sources: `next.config.ts`, `src/lib/api/config.ts`, `src/lib/site.ts`,
`src/config/features.ts`, `SETUP.md`. No `.env.example` or `.env.template` is
present. Do not copy values from local environment files into documentation.

## Evidence

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `compose.yaml`
- `SETUP.md`
