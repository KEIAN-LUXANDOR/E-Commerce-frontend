import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GET /api/auth/me", () => {
  it("returns an unauthenticated session without calling the backend when no cookie exists", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(new NextRequest("http://localhost/api/auth/me"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toBeNull();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes an expired backend session to an unauthenticated response", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    const request = new NextRequest("http://localhost/api/auth/me", {
      headers: { cookie: "JSESSIONID=expired" },
    });
    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/auth\/me$/),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "JSESSIONID=expired" },
      }),
    );
  });

  it("preserves upstream failures instead of returning a success-shaped fallback", async () => {
    vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({ detail: "Backend unavailable" }, { status: 503 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new NextRequest("http://localhost/api/auth/me", {
      headers: { cookie: "JSESSIONID=active" },
    });
    const response = await GET(request);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ detail: "Backend unavailable" });
  });
});
