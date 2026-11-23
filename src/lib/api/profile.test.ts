import { afterEach, describe, expect, it, vi } from "vitest";

describe("profile API", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("updates profile details with the documented endpoint and CSRF protection", async () => {
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

      return Response.json({
        id: "customer-id",
        email: "riya@example.com",
        fullName: "Riya Shah",
        phone: null,
        role: "CUSTOMER",
        emailVerified: true,
        createdAt: "2026-01-10T00:00:00Z",
      });
    });

    vi.resetModules();
    const { updateProfile } = await import("@/lib/api/profile");
    const updatedUser = await updateProfile({ fullName: "Riya Shah", phone: null });

    expect(updatedUser.fullName).toBe("Riya Shah");
    expect(calls.map(({ url, method }) => [
      url.endsWith("/auth/csrf") ? "/auth/csrf" : url.slice(url.indexOf("/account")),
      method,
    ])).toEqual([
      ["/auth/csrf", "GET"],
      ["/account/profile", "PUT"],
    ]);
    expect(calls[1].token).toBe("csrf-token");
    expect(JSON.parse(calls[1].body!)).toEqual({ fullName: "Riya Shah", phone: null });
  });
});
