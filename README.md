# E-commerce frontend

Next.js storefront using the documented Spring Boot product and category APIs.
It displays a clear empty state when the catalogue has no records.

## Development

Run commands from the repository root:

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. Keep only one dev server running for this project;
stop it before reinstalling dependencies or running a production build.

Other root commands: `npm run lint`, `npm run typecheck`, `npm test`, and
`npm run build`.

For backend startup, environment configuration, and the supported API routes, see
[`SETUP.md`](SETUP.md) and [`../docs/api.md`](../docs/api.md).
