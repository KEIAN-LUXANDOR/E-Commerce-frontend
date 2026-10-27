import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/session", () => ({
  sessionStore: {
    useSession: () => ({ status: "loading", user: null }),
  },
}));

import { AdminShell } from "../AdminShell";
import { DiamondList } from "../DiamondList";

describe("admin access and inventory", () => {
  it("waits for the session before rendering protected content", () => {
    const html = renderToString(
      <AdminShell>
        <div>Protected content</div>
      </AdminShell>,
    );

    expect(html).toContain("Verifying access");
    expect(html).not.toContain("Protected content");
  });

  it("renders the inventory screen", () => {
    expect(renderToString(<DiamondList />)).toContain("Inventory Diamonds");
  });
});
