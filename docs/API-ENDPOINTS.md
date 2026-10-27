# Frontend API contract and backend coverage

Base path: `/api/v1`. The frontend calls browser requests through `/api`, which
Next.js rewrites to the configured backend. Planned endpoint feature switches
remain off until the corresponding backend routes and response contracts exist.

## Present in the inspected backend

These routes have controllers in the backend source:

| Route | Methods |
|---|---|
| `/products`, `/products/{slug}` | `GET` |
| `/categories`, `/categories/{slug}/products` | `GET` |
| `/auth/register`, `/auth/login`, `/auth/me`, `/auth/csrf`, `/auth/logout` | `GET`, `POST` |
| `/auth/verify-email`, `/auth/resend-verification`, `/auth/forgot-password`, `/auth/reset-password` | `POST` |
| `/account/cart`, `/account/cart/items/{variantId}` | `GET`, `PUT`, `DELETE` |
| `/account/addresses`, `/account/addresses/states`, `/account/addresses/{id}`, `/account/addresses/{id}/default` | `GET`, `POST`, `PUT`, `DELETE` |
| `/account/profile` | `GET`, `PUT` |
| `/account/change-password` | `POST` |
| `/account/checkout-eligibility` | `GET` |
| `/account/wishlist`, `/account/wishlist/ids`, `/account/wishlist/{productId}` | `GET`, `PUT`, `DELETE` |
| `/account/orders`, `/account/orders/{orderNumber}`, `/account/orders/{orderNumber}/cancel` | `GET`, `POST` |

Coverage is based on controllers under `backend/src/main/java`; it does not
assert live-data or production deployment status.

## Planned: customer and public APIs not present in backend controllers

| Frontend feature | Required route(s) |
|---|---|
| Payment | `POST /account/orders/{orderNumber}/payment`; `POST /account/orders/{orderNumber}/payment/verify` |
| Invoice | `GET /account/orders/{orderNumber}/invoice` |
| Return request | `POST /account/orders/{orderNumber}/return` |
| Order tracking | `POST /orders/track` |
| Cart coupon | `POST`, `DELETE /account/cart/coupon` |
| Delivery PIN check | `GET /delivery/pincode/{pin}` |
| Enquiry form | `POST /enquiries` |
| Newsletter | `POST /newsletter` |
| Banners | `GET /banners/active` |
| Similar products | `GET /products/{slug}/similar` |
| Featured products | `GET /products/featured?type=new|best` |

There is legacy frontend code that calls `GET /pincodes/{pin}` instead of the
canonical `/delivery/pincode/{pin}`. The legacy component currently has no
callers; keep the two paths from becoming separate backend contracts.

## Planned: admin APIs not present in backend controllers

All routes below require admin authorization and the corresponding frontend
feature switch:

| Feature | Required route(s) |
|---|---|
| Dashboard | `GET /admin/summary` |
| Product management | `GET, POST /admin/products`; `GET, PUT, DELETE /admin/products/{id}`; `PUT /admin/products/{id}/status` |
| Product images and CSV | `POST /admin/products/{id}/images`; `DELETE /admin/products/{id}/images/{imageId}`; `PUT /admin/products/{id}/images/order`; `POST /admin/products/import?dryRun={boolean}` |
| Orders and shipping | `GET /admin/orders`; `GET /admin/orders/{orderNumber}`; `POST /admin/orders/{orderNumber}/ship`, `/deliver`, `/cancel`, `/notes` |
| Packing | `GET /admin/packing` |
| Customers | `GET /admin/customers`; `GET /admin/customers/{id}` |
| Returns | `GET /admin/returns`; `GET /admin/returns/{id}`; `POST /admin/returns/{id}/{approve,reject,receive,refund}` |
| Coupons | `GET, POST /admin/coupons`; `PUT, DELETE /admin/coupons/{id}` |
| Enquiries | `GET /admin/enquiries`; `PUT /admin/enquiries/{id}/status` |

## Frontend behavior

`orders` is enabled by default because create, list, detail, and unpaid cancel
routes exist. Payment, invoice, return, coupon, support, and admin entries
remain feature-gated off by default.
The banners, similar-product, and featured-product requests are currently
ungated; avoid relying on them until their backend routes exist. Do not enable a
switch until authorization, CSRF behavior, schemas, and errors are verified.

## Evidence

- `src/config/features.ts`
- `src/lib/api/admin.ts`
- `src/lib/api/orders.ts`
- `src/lib/api/support.ts`
- `src/lib/api/catalog.ts`
- `src/lib/api/catalog-browser.ts`
- `../backend/backend/src/main/java/com/keianluxandor/backend`
- `../backend/backend/src/main/java/com/keianluxandor/backend/config/SecurityConfig.java`
