import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for plain logic (filters, formatting). Component tests can add jsdom later.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"] },
});
