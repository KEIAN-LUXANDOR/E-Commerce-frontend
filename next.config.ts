import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const apiUrl = (process.env.API_URL ?? "http://localhost:8080").replace(/\/+$/, "");
const frontendRoot = dirname(fileURLToPath(import.meta.url));
const turbopackRoot = existsSync(join(frontendRoot, "node_modules", "next", "package.json"))
  ? frontendRoot
  : dirname(frontendRoot);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/store",
        destination: "/diamonds",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API !== "false") return [];
    return [
      { source: "/api/:path*", destination: `${apiUrl}/api/v1/:path*` },
      // Product photos served by Spring Boot (/images/**) load from the same address as the website
      { source: "/images/:path*", destination: `${apiUrl}/images/:path*` },
    ];
  },
  turbopack: {
    root: turbopackRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
