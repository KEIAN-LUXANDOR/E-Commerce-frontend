import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { proxy } from "./proxy";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("admin authorization proxy", () => {
  const request = () =>
    new NextRequest("https://store.example/admin/orders", {
      headers: { cookie: "JSESSIONID=active" },
    });

  it("fails closed when the backend returns an error", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    const response = await proxy(request());

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Retry-After")).toBe("30");
  });

  it("fails closed when the backend cannot be reached", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));

    const response = await proxy(request());

    expect(response.status).toBe(503);
  });

  it("redirects users without an admin role", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      Response.json({ role: "CUSTOMER" }),
    ));

    const response = await proxy(request());

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://store.example/admin/unauthorized");
  });

  it.each(["ADMIN", "OWNER"])("allows the %s role", async (role) => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ role })));

    const response = await proxy(request());

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
