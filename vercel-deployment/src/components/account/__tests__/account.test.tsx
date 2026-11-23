import { describe, expect, it } from "vitest";
import { isAdminRole } from "@/lib/types/auth";

describe("account roles", () => {
  it("limits admin access to admin and owner roles", () => {
    expect(isAdminRole("ADMIN")).toBe(true);
    expect(isAdminRole("OWNER")).toBe(true);
    expect(isAdminRole("CUSTOMER")).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});
