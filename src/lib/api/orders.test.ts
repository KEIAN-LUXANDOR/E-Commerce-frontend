import { afterEach, describe, expect, it, vi } from "vitest";

describe("order API", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("maps the backend order-page contract to the order-history summary", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn(async () => Response.json({
      items: [{
        orderNumber: "KL100001",
        status: "PENDING_PAYMENT",
        createdAt: "2026-10-27T10:00:00Z",
        expiresAt: "2026-10-27T10:15:00Z",
        paidAt: null,
        cancelledAt: null,
        cancelReason: null,
        items: [
          { lineNumber: 1, productSlug: "round-1ct", productName: "Round 1ct", sku: "R1", description: null, imageUrl: "/images/round.webp", pricePaise: 100000 },
          { lineNumber: 2, productSlug: "oval-1ct", productName: "Oval 1ct", sku: "O1", description: null, imageUrl: null, pricePaise: 110000 },
        ],
        subtotalPaise: 210000,
        shippingPaise: 0,
        discountPaise: 0,
        gstPaise: 0,
        totalPaise: 210000,
        currency: "INR",
        shippingAddress: {
          fullName: "Test User",
          phone: "9999999999",
          line1: "1 Test Road",
          line2: null,
          landmark: null,
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
      }],
      page: 2,
      size: 10,
      totalItems: 21,
      totalPages: 3,
    }));
    vi.stubGlobal("fetch", fetchMock);

    const { listOrders } = await import("@/lib/api/orders");
    const result = await listOrders(2, 10);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/account/orders?page=2&size=10",
      expect.objectContaining({ method: "GET", credentials: "include" }),
    );
    expect(result).toMatchObject({
      page: 2,
      totalPages: 3,
      items: [{
        orderNumber: "KL100001",
        itemCount: 2,
        firstItemName: "Round 1ct",
        firstItemImageUrl: "/images/round.webp",
        totalPaise: 210000,
      }],
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
