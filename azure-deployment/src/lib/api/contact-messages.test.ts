import { afterEach, describe, expect, it, vi } from "vitest";
import { clearCsrfToken } from "./client";

afterEach(() => {
  clearCsrfToken();
  vi.unstubAllGlobals();
});

describe("contact message API", () => {
  it("posts the public contact payload without fetching or sending a CSRF token", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ message: "Received" }));
    vi.stubGlobal("fetch", fetchMock);
    const body = {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 213 555 0100",
      subject: "Question about a diamond",
      orderNumber: "KL100019",
      message: "Is the 1.01 ct round available?",
      website: "",
    };

    const { sendContactMessage } = await import("./support");
    await sendContactMessage(body);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    }));
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).has("X-CSRF-TOKEN")).toBe(false);
  });

  it("loads contact stats, filtered pages, and individual messages from the admin endpoints", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ newMessages: 3, totalMessages: 12 }))
      .mockResolvedValueOnce(Response.json({ items: [], page: 0, size: 20, totalItems: 0, totalPages: 0 }))
      .mockResolvedValueOnce(Response.json({ id: "message-1", name: "John Smith" }));
    vi.stubGlobal("fetch", fetchMock);

    const { getContactMessageStats, getContactMessage, listContactMessages } = await import("./admin");
    await expect(getContactMessageStats()).resolves.toEqual({ newMessages: 3, totalMessages: 12 });
    await expect(listContactMessages({ status: "NEW" })).resolves.toMatchObject({ page: 0, size: 20 });
    await expect(getContactMessage("message/1")).resolves.toMatchObject({ id: "message-1" });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/api/admin/contact-messages/stats",
      "/api/admin/contact-messages?status=NEW&page=0&size=20",
      "/api/admin/contact-messages/message%2F1",
    ]);
  });

  it("requests a CSRF token for the admin mark-as-handled PUT", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ token: "admin-csrf" }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    const { markContactMessageHandled } = await import("./admin");
    await markContactMessageHandled("message-1");

    expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/csrf");
    expect(fetchMock.mock.calls[1][0]).toBe("/api/admin/contact-messages/message-1/handled");
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: "PUT", credentials: "include" });
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get("X-CSRF-TOKEN")).toBe("admin-csrf");
  });
});
