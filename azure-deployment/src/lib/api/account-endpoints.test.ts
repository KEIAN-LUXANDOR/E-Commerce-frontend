import { afterEach, describe, expect, it, vi } from "vitest";

describe("documented account endpoints", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the account routes, payloads, and CSRF protection for mutations", async () => {
    vi.stubGlobal("window", {});
    const calls: { url: string; method: string; body?: string; token: string | null }[] = [];
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push({
        url,
        method,
        body: typeof init?.body === "string" ? init.body : undefined,
        token: new Headers(init?.headers).get("X-CSRF-TOKEN"),
      });

      if (url.endsWith("/auth/csrf")) {
        return Response.json({ headerName: "X-CSRF-TOKEN", token: "csrf-token" });
      }
      if (method === "DELETE" || method === "PUT") return new Response(null, { status: 204 });
      if (url.endsWith("/account/checkout-eligibility")) return Response.json({ canCheckout: true });
      if (url.endsWith("/account/wishlist/ids")) return Response.json(["product-id"]);
      if (url.endsWith("/account/wishlist")) return Response.json([]);
      if (url.endsWith("/account/cart")) return Response.json({});
      return Response.json({ message: "Your password has been changed." });
    });

    vi.resetModules();
    const [{ changePassword }, { getCheckoutEligibility }, { addCartItem, clearCart, getCart, removeCartItem }, { addWishlistProduct, getWishlist, getWishlistProductIds, removeWishlistProduct }] =
      await Promise.all([
        import("@/lib/api/profile"),
        import("@/lib/api/account"),
        import("@/lib/api/cart"),
        import("@/lib/api/wishlist"),
      ]);

    await getWishlist();
    await getWishlistProductIds();
    await addWishlistProduct("product/id");
    await removeWishlistProduct("product-id");
    await getCart();
    await addCartItem("variant-id");
    await removeCartItem("variant-id");
    await clearCart();
    await changePassword({ currentPassword: "OldPass@123", newPassword: "NewPass@123" });
    await getCheckoutEligibility();

    expect(calls.map(({ url, method }) => [
      url.endsWith("/auth/csrf") ? "/auth/csrf" : url.slice(url.indexOf("/account")),
      method,
    ])).toEqual([
      ["/account/wishlist", "GET"],
      ["/account/wishlist/ids", "GET"],
      ["/auth/csrf", "GET"],
      ["/account/wishlist/product%2Fid", "PUT"],
      ["/account/wishlist/product-id", "DELETE"],
      ["/account/cart", "GET"],
      ["/account/cart/items/variant-id", "PUT"],
      ["/account/cart/items/variant-id", "DELETE"],
      ["/account/cart", "DELETE"],
      ["/account/change-password", "POST"],
      ["/account/checkout-eligibility", "GET"],
    ]);
    expect(calls.filter(({ method }) => method !== "GET").every(({ token }) => token === "csrf-token")).toBe(true);
    expect(JSON.parse(calls.find(({ url }) => url.endsWith("/account/change-password"))!.body!)).toEqual({
      currentPassword: "OldPass@123",
      newPassword: "NewPass@123",
    });
  });

  it("preserves machine-readable checkout eligibility errors", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("fetch", async () => Response.json({
      status: 403,
      title: "Forbidden",
      detail: "Please verify your email address before placing an order.",
      code: "EMAIL_NOT_VERIFIED",
    }, { status: 403 }));

    vi.resetModules();
    const { getCheckoutEligibility } = await import("@/lib/api/account");

    await expect(getCheckoutEligibility()).rejects.toMatchObject({
      status: 403,
      code: "EMAIL_NOT_VERIFIED",
      message: "Please verify your email address before placing an order.",
    });
  });
});
