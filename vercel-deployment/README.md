# Vercel deployment

This folder is a standalone copy of the frontend and its runtime assets.
It omits local lint tooling; Vercel only needs the production build dependencies.

1. Push `vercel-deployment` to GitHub.
2. In Vercel, import the repository and set **Root Directory** to `vercel-deployment`.
3. Use the detected Next.js framework settings and commit the lockfile.
4. Add these Production (and Preview, if desired) environment variables in
   **Project Settings → Environment Variables**:
   - `API_URL` = `https://api.keianluxlandor.in/api/v1`
   - `NEXT_PUBLIC_USE_MOCK_API` = `false`
   - `NEXT_PUBLIC_SITE_URL` = your deployed storefront URL, for example
     `https://your-store.vercel.app` or your configured custom domain (never `localhost` in production)
5. Deploy. Redeploy after changing environment variables.

The backend URL is also the default in the app configuration. `API_URL` must
include `/api/v1`; the frontend uses that versioned base for API requests and
the host root for product images. Do not commit `.env.local` or secrets;
`.env.example` is only a variable-name template.
