import { afterEach, describe, expect, it, vi } from "vitest";

describe("delivery address API", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the documented endpoints and protects mutations with CSRF", async () => {
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
      if (method === "DELETE") return new Response(null, { status: 204 });
      if (url.endsWith("/account/addresses/states")) return Response.json(["Maharashtra"]);
      if (method === "GET") return Response.json([]);
      return Response.json({
        id: "address-id",
        fullName: "Riya Shah",
        phone: "9876543210",
        line1: "10 Koregaon Park",
        line2: null,
        landmark: null,
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        defaultAddress: true,
      });
    });
    vi.resetModules();
    const {
      createDeliveryAddress,
      deleteDeliveryAddress,
      getDeliveryAddresses,
      getIndianStates,
      setDefaultDeliveryAddress,
      updateDeliveryAddress,
    } = await import("@/lib/api/addresses");

    const body = {
      fullName: "Riya Shah",
      phone: "9876543210",
      line1: "10 Koregaon Park",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    };

    await getDeliveryAddresses();
    await getIndianStates();
    await createDeliveryAddress(body);
    await updateDeliveryAddress("address-id", body);
    await setDefaultDeliveryAddress("address-id");
    await deleteDeliveryAddress("address-id");

    expect(calls.map(({ url, method }) => [
      url.includes("/auth/csrf") ? "/auth/csrf" : url.slice(url.indexOf("/account")),
      method,
    ])).toEqual([
      ["/account/addresses", "GET"],
      ["/account/addresses/states", "GET"],
      ["/auth/csrf", "GET"],
      ["/account/addresses", "POST"],
      ["/account/addresses/address-id", "PUT"],
      ["/account/addresses/address-id/default", "PUT"],
      ["/account/addresses/address-id", "DELETE"],
    ]);
    expect(calls.filter(({ method }) => method !== "GET").every(({ token }) => token === "csrf-token")).toBe(true);
    expect(JSON.parse(calls[3].body!)).toEqual(body);
    expect(JSON.parse(calls[4].body!)).toEqual(body);
  });
});
