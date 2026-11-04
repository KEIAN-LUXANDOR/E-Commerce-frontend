import { describe, expect, it, vi } from "vitest";

describe("orders api", () => {
  it("translates order listing pages to UI summaries", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        page: 0,
        size: 20,
        totalItems: 1,
        totalPages: 1,
        items: [
          {
            orderNumber: "KL100001",
            status: "PAID",
            createdAt: "2026-10-28T00:00:00.000Z",
            totalPaise: 18500000,
            items: [
              {
                productName: "1.00 ct Round Lab-grown Diamond",
                imageUrl: "/images/round.svg",
              },
            ],
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { listOrders } = await import("@/lib/api/orders");
    const result = await listOrders(0, 20);

    expect(result).toEqual({
      page: 0,
      size: 20,
      totalItems: 1,
      totalPages: 1,
      items: [
        {
          orderNumber: "KL100001",
          status: "PAID",
          createdAt: "2026-10-28T00:00:00.000Z",
          itemCount: 1,
          totalPaise: 18500000,
          firstItemName: "1.00 ct Round Lab-grown Diamond",
          firstItemImageUrl: "/images/round.svg",
        },
      ],
    });
  });

  it("uses the supplied Razorpay create and verify contracts", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ token: "csrf-test" }))
      .mockResolvedValueOnce(Response.json({
        keyId: "rzp_test_public",
        razorpayOrderId: "order_test",
        amountPaise: 18500000,
        currency: "INR",
        orderNumber: "KL100003",
        expiresAt: "2026-10-28T06:31:43Z",
        customerName: "Riya Shah",
        customerEmail: "riya@example.com",
        customerPhone: "+919876543210",
      }))
      .mockResolvedValueOnce(Response.json({ message: "verified" }));
    vi.stubGlobal("fetch", fetchMock);

    const { startPayment, confirmPayment } = await import("@/lib/api/orders");
    const session = await startPayment("KL100003");
    await confirmPayment("KL100003", {
      razorpayOrderId: "order_test",
      razorpayPaymentId: "pay_test",
      razorpaySignature: "signature_from_checkout",
    });

    expect(session).toMatchObject({
      keyId: "rzp_test_public",
      razorpayOrderId: "order_test",
      amountPaise: 18500000,
      currency: "INR",
      orderNumber: "KL100003",
    });
    expect(fetchMock.mock.calls[1][0]).toBe(
      "/api/account/orders/KL100003/payment",
    );
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: "POST",
      body: undefined,
      credentials: "include",
    });
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get("X-CSRF-TOKEN")).toBe("csrf-test");
    expect(fetchMock.mock.calls[2][0]).toBe(
      "/api/account/orders/KL100003/payment/verify",
    );
    expect(fetchMock.mock.calls[2][1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({
        razorpayOrderId: "order_test",
        razorpayPaymentId: "pay_test",
        razorpaySignature: "signature_from_checkout",
      }),
      credentials: "include",
    });
    expect(new Headers(fetchMock.mock.calls[2][1]?.headers).get("X-CSRF-TOKEN")).toBe("csrf-test");
  });
});
