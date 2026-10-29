# Frontend API endpoint inventory

This lists API routes called or constructed by the frontend, including legacy
and planned calls. It does not imply that every route exists on the backend.

## URL construction

- Browser helpers call `/api/...`; `next.config.ts` rewrites this to
  `${API_URL}/api/v1/...`.
- Server helpers call `${API_URL}/api/v1/...` directly.
- `API_URL` is configured in `.env.local` / deployment environment and defaults
  to `http://localhost:8080`. The browser does not expose this value.
- Session cookies and CSRF handling are centralized in
  `src/lib/api/client.ts`.

## Authentication

| Method | Endpoint | Source file |
|---|---|---|
| GET | `/auth/csrf` | `src/lib/api/client.ts` (`getCsrfToken`) |
| POST | `/auth/register` | `src/lib/api/auth.ts` (`register`) |
| POST | `/auth/login` | `src/lib/api/auth.ts` (`login`) |
| POST | `/auth/logout` | `src/lib/api/auth.ts` (`logout`) |
| GET | `/auth/me` | `src/lib/api/auth.ts` (`getMe`); also direct backend URL in `src/proxy.ts` |
| POST | `/auth/verify-email` | `src/lib/api/auth.ts` (`verifyEmail`) |
| POST | `/auth/resend-verification` | `src/lib/api/auth.ts` (`resendVerification`) |
| POST | `/auth/forgot-password` | `src/lib/api/auth.ts` (`forgotPassword`) |
| POST | `/auth/reset-password` | `src/lib/api/auth.ts` (`resetPassword`) |

## Products and categories

| Method | Endpoint | Source file |
|---|---|---|
| GET | `/products` (filters, paging, sort) | `src/lib/api/products.ts`, `src/lib/api/products-browser.ts`, `src/lib/api/store.ts`, `src/lib/api/catalog.ts` |
| GET | `/products/{slug}` | `src/lib/api/products.ts`, `src/lib/api/products-browser.ts`, `src/lib/api/store.ts`, `src/lib/api/catalog.ts` |
| GET | `/products?q={query}&page=0&size=6` | `src/lib/api/catalog-browser.ts` (search suggestions) |
| GET | `/categories` | `src/lib/api/categories.ts`, `src/lib/api/catalog.ts`, `src/lib/api/store.ts` |
| GET | `/categories/{slug}/products` | `src/lib/api/categories.ts` |
| GET | `/products/{slug}/similar` | `src/lib/api/catalog.ts` (legacy/planned) |
| GET | `/products/featured?type={new|best}` | `src/lib/api/catalog.ts` (legacy/planned) |
| GET | `/banners/active` | `src/lib/api/catalog.ts`, `src/app/admin/banners/page.tsx` (planned) |

## Customer account

| Method | Endpoint | Source file |
|---|---|---|
| GET | `/account/profile` | No direct GET helper currently; profile update uses `src/lib/api/profile.ts` |
| PUT | `/account/profile` | `src/lib/api/profile.ts` (`updateProfile`) |
| POST | `/account/change-password` | `src/lib/api/profile.ts` (`changePassword`) |
| GET | `/account/checkout-eligibility` | `src/lib/api/account.ts` |
| GET | `/account/addresses` | `src/lib/api/addresses.ts` |
| POST | `/account/addresses` | `src/lib/api/addresses.ts` |
| GET | `/account/addresses/states` | `src/lib/api/addresses.ts` |
| PUT, DELETE | `/account/addresses/{id}` | `src/lib/api/addresses.ts` |
| PUT | `/account/addresses/{id}/default` | `src/lib/api/addresses.ts` |
| GET | `/account/orders?page={page}&size={size}` | `src/lib/api/orders.ts` |
| POST | `/account/orders` | `src/lib/api/orders.ts` |
| GET | `/account/orders/{orderNumber}` | `src/lib/api/orders.ts` |
| POST | `/account/orders/{orderNumber}/cancel` | `src/lib/api/orders.ts` |
| POST | `/account/orders/{orderNumber}/payment` | `src/lib/api/orders.ts` |
| POST | `/account/orders/{orderNumber}/payment/verify` | `src/lib/api/orders.ts` |
| GET | `/account/orders/{orderNumber}/invoice` | `src/lib/api/orders.ts` (`invoiceUrl`; constructed, not fetched by this helper) |
| POST | `/account/orders/{orderNumber}/return` | `src/lib/api/orders.ts` |
| POST | `/orders/track` | `src/lib/api/orders.ts` |

## Cart and wishlist

| Method | Endpoint | Source file |
|---|---|---|
| GET, DELETE | `/account/cart` | `src/lib/api/cart.ts` |
| PUT, DELETE | `/account/cart/items/{variantId}` | `src/lib/api/cart.ts`, `src/lib/shop/cart.ts` |
| POST, DELETE | `/account/cart/coupon` | `src/lib/api/cart.ts` (planned) |
| GET | `/account/wishlist` | `src/lib/api/wishlist.ts` |
| GET | `/account/wishlist/ids` | `src/lib/api/wishlist.ts`, `src/lib/shop/wishlist.ts` |
| PUT, DELETE | `/account/wishlist/{productId}` | `src/lib/api/wishlist.ts`, `src/lib/shop/wishlist.ts` |

## Support and delivery

| Method | Endpoint | Source file |
|---|---|---|
| POST | `/enquiries` | `src/lib/api/support.ts` (planned) |
| POST | `/newsletter` | `src/lib/api/support.ts` (planned) |
| GET | `/delivery/pincode/{pincode}` | `src/lib/api/support.ts` (planned) |
| GET | `/pincodes/{pincode}` | `src/lib/api/support.ts` fallback; also `src/lib/api/catalog-browser.ts` (legacy/planned) |
| POST | `/contact` | `src/components/contact/ContactForm.tsx` (legacy direct call) |

## Admin

All routes below are called through `src/lib/api/admin.ts` unless noted.
They are feature-gated and require backend support.

| Method | Endpoint |
|---|---|
| GET | `/admin/summary` |
| GET, POST | `/admin/products` |
| GET, PUT, DELETE | `/admin/products/{id}` |
| PUT | `/admin/products/{id}/status` |
| POST | `/admin/products/{id}/images` |
| DELETE | `/admin/products/{id}/images/{imageId}` |
| PUT | `/admin/products/{id}/images/order` |
| POST | `/admin/products/import?dryRun={boolean}` |
| GET | `/admin/orders` |
| GET | `/admin/orders/{orderNumber}` |
| POST | `/admin/orders/{orderNumber}/ship`, `/deliver`, `/cancel`, `/notes` |
| GET | `/admin/packing` |
| GET | `/admin/customers`, `/admin/customers/{id}` |
| GET | `/admin/returns`, `/admin/returns/{id}` |
| POST | `/admin/returns/{id}/{approve|reject|receive|refund}` |
| GET, POST | `/admin/coupons` |
| PUT, DELETE | `/admin/coupons/{id}` |
| GET | `/admin/enquiries` |
| PUT | `/admin/enquiries/{id}/status` |
| GET | `/banners/active` (`src/app/admin/banners/page.tsx`; planned) |

## Legacy direct calls to review

These are separate from the current typed API helpers and may not match the
backend contract:

| Method | Endpoint | Source file |
|---|---|---|
| PUT | `/account/password` | `src/components/account/ChangePasswordForm.tsx` (current helper uses `POST /account/change-password`) |
| POST | `/contact` | `src/components/contact/ContactForm.tsx` (current support helper uses `POST /enquiries`) |
| GET | `/pincodes/{pincode}` | `src/lib/api/catalog-browser.ts` and fallback in `src/lib/api/support.ts` |

The health endpoint `/actuator/health` is a backend/operations endpoint; no
frontend caller was found.
