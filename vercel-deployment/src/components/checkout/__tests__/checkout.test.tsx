import { describe, expect, it } from "vitest";
import { ORDER_STATUS_LABEL } from "@/lib/types/order";

describe("checkout order state", () => {
  it("keeps payment-pending orders distinct from paid orders", () => {
    expect(ORDER_STATUS_LABEL.PENDING_PAYMENT).toMatch(/payment/i);
    expect(ORDER_STATUS_LABEL.PAID).toMatch(/paid/i);
  });
});
