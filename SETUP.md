# Store frontend setup

The Next.js storefront consumes the documented generic product/category contract
in [`../docs/api.md`](../docs/api.md). No diamond-specific, banner, suggestion, or
pincode endpoints are required by the active storefront pages.

## Prerequisites

- Node.js and npm
- PostgreSQL, started locally with Docker Compose
- The Spring Boot backend

## Install and configure

From the repository root:

```powershell
npm install
```

Create `diamond-frontend/.env.local` with:

```dotenv
NEXT_PUBLIC_USE_MOCK_API=false
API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart Next.js after changing environment variables. The backend API origin is
`API_URL`; server requests use `/api/v1`, and browser requests go through the
Next.js `/api` rewrite to the same backend prefix.

## Run services

Start PostgreSQL and the backend from the repository root:

```powershell
docker compose up -d db
.\backend\mvnw.cmd -f backend\pom.xml spring-boot:run
```

Then start the frontend in a second terminal:

```powershell
npm run dev
```

The database is published at `localhost:5433`, the backend at `localhost:8080`,
and the frontend at <http://localhost:3000>. Verify the backend/database at
<http://localhost:8080/actuator/health>.

## Storefront routes

| Page | Address |
|---|---|
| Home | `http://localhost:3000/` |
| All products | `http://localhost:3000/shop` |
| Category | `http://localhost:3000/shop/{category-slug}` |
| Search | `http://localhost:3000/search?q={query}` |
| Product | `http://localhost:3000/product/{product-slug}` |
| Log in | `http://localhost:3000/login` |
| Create account | `http://localhost:3000/register` |
| Verify email | `http://localhost:3000/verify-email?token={token}` |
| Forgot password | `http://localhost:3000/forgot-password` |
| Reset password | `http://localhost:3000/reset-password?token={token}` |
| Your account | `http://localhost:3000/account` (sends you to log in first if you aren't) |

The account page lets signed-in customers view, add, edit, delete, and choose a
default delivery address. Address changes use the authenticated
`/api/v1/account/addresses` endpoints documented in `docs/api.md`.

The shop supports the documented `q`, `category`, `minPrice`, `maxPrice`, `sort`,
`page`, and `size` product filters. In the website address and the price form,
`minPrice`/`maxPrice` are in **rupees**; the frontend multiplies by 100 before
calling the API, which filters in paise. Categories and products are empty until
records have been added to PostgreSQL.

## Accounts and errors

- Login uses the backend's `JSESSIONID` session cookie. Browser calls go through
  the `/api` rewrite, so the cookie belongs to the website's own address and no
  CORS setup is needed in development.
- Auth calls match `docs/api.md`: verification uses `POST /auth/verify-email`
  with `{ token }`; resend and forgot-password use `{ email }`; reset uses
  `POST /auth/reset-password` with `{ token, newPassword }`.
- `src/lib/api/client.ts` adds the CSRF token (from `GET /auth/csrf`) to
  protected mutations. Register, login, verify-email, resend-verification,
  forgot-password, and reset-password are public CSRF-exempt endpoints per the API contract.
- Errors are read from the backend's ProblemDetail body: `detail` is shown above
  the form, and each entry in `errors` is shown next to its field.
- The backend must include the 401 and 429 handlers in `ApiExceptionHandler`
  (Part B), or wrong passwords show as a server error.

## Validation

Run from the repository root:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```
