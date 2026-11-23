import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, toApiError } from "@/lib/api/client";
import { normalisePhone, safeNextPath, validateRegister } from "@/lib/validators";

describe("reading backend errors (ProblemDetail)", () => {
  it("keeps the detail and every field error from a 400", async () => {
    const res = new Response(
      JSON.stringify({
        status: 400,
        title: "Invalid Input",
        detail: "One or more fields are invalid.",
        errors: [
          { field: "email", message: "Enter a valid email address" },
          { field: "password", message: "Password must be 8 to 72 characters" },
        ],
      }),
      { status: 400, headers: { "Content-Type": "application/problem+json" } },
    );
    const err = await toApiError(res);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(400);
    expect(err.message).toBe("One or more fields are invalid.");
    expect(err.fieldErrors).toEqual({ email: "Enter a valid email address", password: "Password must be 8 to 72 characters" });
  });

  it("uses the 409 and 429 details as written by the backend", async () => {
    const conflict = await toApiError(new Response(JSON.stringify({ status: 409, title: "Conflict", detail: "An account with this email already exists." }), { status: 409 }));
    expect(conflict.message).toBe("An account with this email already exists.");
    const locked = await toApiError(new Response("", { status: 429 }));
    expect(locked.message).toMatch(/Too many attempts/);
  });

  it("falls back to a readable message when the body isn't JSON", async () => {
    const err = await toApiError(new Response("<html>Bad gateway</html>", { status: 502 }));
    expect(err.message).toMatch(/having trouble/);
  });
});

describe("CSRF token on changes", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("submits register payload without CSRF token", async () => {
    vi.stubGlobal("window", {});
    const calls: { url: string; body: unknown; token: string | null }[] = [];
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      calls.push({
        url,
        body: typeof init?.body === "string" ? JSON.parse(init.body) : init?.body,
        token: new Headers(init?.headers).get("X-CSRF-TOKEN"),
      });
      return Response.json({
        id: "usr-123",
        email: "riya@example.com",
        fullName: "Riya Shah",
        role: "CUSTOMER",
        emailVerified: false,
        createdAt: "2026-10-28T00:00:00Z",
      }, { status: 201 });
    });
    vi.resetModules();
    const { register } = await import("@/lib/api/auth");
    const user = await register({
      fullName: "Riya Shah",
      email: "riya@example.com",
      password: "Secret@123",
    });

    expect(user.id).toBe("usr-123");
    expect(calls[0].url).toContain("/auth/register");
    expect(calls[0].body).toEqual({
      fullName: "Riya Shah",
      email: "riya@example.com",
      password: "Secret@123",
    });
    expect(calls[0].token).toBeNull();
  });

  it("uses the documented public account endpoints and payload fields without CSRF", async () => {
    vi.stubGlobal("window", {});
    const calls: { url: string; body: string | undefined; token: string | null }[] = [];
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      calls.push({
        url,
        body: typeof init?.body === "string" ? init.body : undefined,
        token: new Headers(init?.headers).get("X-CSRF-TOKEN"),
      });
      return Response.json({ message: "Request received." }, { status: 202 });
    });
    vi.resetModules();
    const { requestPasswordReset, resendVerification, resetPassword, verifyEmail } = await import("@/lib/api/auth");

    await verifyEmail("verify-token");
    await resendVerification("riya@example.com");
    await requestPasswordReset("riya@example.com");
    await resetPassword({ token: "reset-token", newPassword: "Secret@123" });

    expect(calls.map(({ url, body, token }) => [url.slice(url.indexOf("/auth")), JSON.parse(body!), token])).toEqual([
      ["/auth/verify-email", { token: "verify-token" }, null],
      ["/auth/resend-verification", { email: "riya@example.com" }, null],
      ["/auth/forgot-password", { email: "riya@example.com" }, null],
      ["/auth/reset-password", { token: "reset-token", newPassword: "Secret@123" }, null],
    ]);
  });

  it("fetches a token, sends it, and retries once when the backend rejects an old token", async () => {
    vi.stubGlobal("window", {});
    const calls: { url: string; token: string | null }[] = [];
    let tokenNo = 0;
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      const token = new Headers(init?.headers).get("X-CSRF-TOKEN");
      calls.push({ url, token });
      if (url.endsWith("/auth/csrf")) return Response.json({ headerName: "X-CSRF-TOKEN", token: `t${++tokenNo}` });
      if (token === "t1") return Response.json({ status: 403, title: "Forbidden", detail: "Missing or invalid CSRF token." }, { status: 403 });
      return new Response(null, { status: 204 });
    });
    vi.resetModules();
    const { apiFetch } = await import("@/lib/api/client");
    await apiFetch("/auth/logout", { method: "POST" });
    expect(calls.map((c) => [c.url.slice(c.url.indexOf("/auth")), c.token])).toEqual([
      ["/auth/csrf", null],
      ["/auth/logout", "t1"],
      ["/auth/csrf", null],
      ["/auth/logout", "t2"],
    ]);
  });
});

describe("account form checks", () => {
  it("accepts a valid form and an empty phone", () => {
    expect(validateRegister({ fullName: "Riya Shah", email: "Riya@Example.com ", phone: "", password: "Secret@123" })).toEqual({});
  });

  it("matches the backend's rules", () => {
    const errors = validateRegister({ fullName: "", email: "bad", phone: "12345", password: "123" });
    expect(Object.keys(errors).sort()).toEqual(["email", "fullName", "password", "phone"]);
  });

  it("cleans up Indian phone numbers", () => {
    expect(normalisePhone("+91 98765 43210")).toBe("9876543210");
    expect(normalisePhone("09876543210")).toBe("9876543210");
  });

  it("never sends people to another website after login", () => {
    expect(safeNextPath("/account")).toBe("/account");
    expect(safeNextPath("//evil.com")).toBe("/account");
    expect(safeNextPath("https://evil.com")).toBe("/account");
  });
});
