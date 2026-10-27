# Frontend Errors and Fixes

This file records the blocking errors found in the frontend and the changes that resolved them.

## Build and startup errors

| Error | Cause | Fix |
|---|---|---|
| Admin layout could not resolve `./globals.css` | `src/app/admin/layout.tsx` duplicated the root layout, but no admin-local stylesheet exists. | Replaced it with an `AdminShell` wrapper; global CSS remains in `src/app/layout.tsx`. |
| Static build failed on `/_not-found` with HTTP 401 | The not-found page fetched `/categories` during prerendering. | Removed that backend dependency and linked to the current `/diamonds` routes directly. |
| Static build rejected `new Date()` in the footer | Next.js 16 Cache Components cannot prerender a changing current-time value in a Server Component. | Moved the year to the small client component `CurrentYear`, populated after mount. |
| Prerender failed on URL hooks and dynamic product params | `usePathname`, `useSearchParams`, and the dynamic diamond route needed runtime data without local Suspense boundaries. | Added Suspense boundaries around the admin shell, admin login form, and diamond detail content. |

## TypeScript and lint errors

| Error | Cause | Fix |
|---|---|---|
| `ApiError.detail` does not exist | The frontend error contract exposes the safe backend detail as `message`. | Admin login now displays `ApiError.message`. |
| Diamond detail page used missing exports and incorrect result shapes | It expected `formatPaise`, `GradeScale`, and raw product/page results, while current APIs provide `ProductResult` and `ProductPageResult`. | It now uses `getProduct().product`, `getSimilar`, and `GradeScales`. |
| `CompareTray` export was missing | The listing imported a component from a file that exports a redirect page; `/compare` currently redirects to `/diamonds`. | Removed the unused tray import and render from the listing. |
| Missing site fields and nullable link values | Call sites expected `phoneHref` and `paymentWindowMinutes`, and passed nullable contact URLs to link props. | Added typed site fields and made absent WhatsApp/telephone links `undefined`. The 15-minute payment window matches the API contract. |
| Component props did not match their definitions | Call sites used unsupported `compact`/`variant` props and omitted the required copy-button label. | Added compact sizing to `ProductCard`; used `SaveButton`'s `withLabel` API and supplied the copy label. |
| Unsafe `any` adapters and conditional hook calls | Header and admin code probed multiple outdated store shapes at runtime. | Replaced those adapters with the typed session, cart, wishlist, and auth APIs. |
| React hook/compiler lint errors | Effects triggered state synchronously, date access occurred during render, and a custom hook received caller-defined dependencies. | Moved async state updates into promise/timer callbacks, initialized CSV preview data with a pure parser, and kept the custom hook's dynamic dependency contract with a targeted lint suppression. |
| Legacy `addToCart` export mismatch | Cart actions belong to `src/lib/shop/cart.ts`, not the UI-state store. | The comparison component uses the cart module for `addToCart`; `src/lib/stores.ts` remains for UI state. |

## Test failures

- Admin shell tests now mock the App Router and assert the current admin shell content.
- The WhatsApp test supplies a test phone number instead of depending on local environment configuration.
- Catalog and wishlist tests now exercise the active `ProductCard` and `WishlistView`, rather than retired components that depend on removed legacy store APIs.
- The Razorpay server-render test now expects the gateway's initial loading state and checks the accessible pay-button label.

## Verification

| Check | Result |
|---|---|
| `npm run build` | Passed |
| `npm run typecheck` | Passed |
| `npm test -- --run` | 14 files passed; 132 tests passed |
| `npm run lint` | Passed with 0 errors and 120 non-blocking warnings |
| Production HTTP smoke test | `/` and `/admin/login` returned 200; an unknown route returned 404 |

Run the app locally with `npm run dev`. For production, run `npm run build` followed by `npm run start`.

The remaining lint warnings are primarily unused imports and do not prevent building or starting the app. The old `src/components/store/diamond-card.tsx` and `wishlist-view.tsx` are not used by current routes; migrate their removed store APIs before wiring them back in.
