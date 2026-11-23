# Azure App Service deployment

This is a standalone Next.js server app for **Azure App Service on Linux**.
It preserves server rendering, API routes, and the admin authorization proxy.
Do not deploy it as a static site.

## Configure Azure before the first deployment

Create a Linux Web App on the **Node 24 LTS** runtime. The suggested **B1**
App Service plan is paid; it is not a free tier.

In **App Service → Settings → Environment variables → App settings**, add:

| Name | Value |
| --- | --- |
| `API_URL` | `https://api.keianluxlandor.in` |
| `NEXT_PUBLIC_USE_MOCK_API` | `false` |
| `NEXT_PUBLIC_SITE_URL` | `https://keianluxlandor.in` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |

Add both `keianluxlandor.in` and `www.keianluxlandor.in` as custom hostnames
on the Azure Web App and configure their DNS records as Azure directs. Bind
valid TLS certificates for both names. The app permanently redirects
`www.keianluxlandor.in` requests to `https://keianluxlandor.in`, preserving
the requested path and query.

Set these settings before deployment because `NEXT_PUBLIC_SITE_URL` is
embedded during the Next.js build. Never put secrets in `NEXT_PUBLIC_*`
settings or commit a real `.env` file. Azure's default
`YOUR-APP-NAME.azurewebsites.net` hostname may also be used for testing.

The API setting is the **origin only**. This Azure package adds `/api/v1` to API
requests and sends product images to `/images/**` on the same backend host.

## Create and deploy the ZIP (PowerShell)

From the repository root:

```powershell
.\azure-deployment\package-azure.ps1
az webapp deploy --resource-group YOUR-RESOURCE-GROUP --name YOUR-APP-NAME --src-path .\azure-deployment\azure-deployment.zip --type zip
```

The ZIP contains the contents of this folder at its root, not an enclosing
`azure-deployment` directory. It excludes dependencies, build output, caches,
and local environment files. With build automation enabled, Azure restores
packages and runs the app's `npm run build`.

In **App Service → Settings → Configuration → General settings**, set the
startup command to `npm run start`. Next.js uses the `PORT` provided by App
Service.

After deployment, browse to `https://keianluxlandor.in` and test catalog
loading, sign-in/session cookies, contact form, checkout, and admin
authorization. Backend availability and production behavior have not been
verified by this source package alone.
