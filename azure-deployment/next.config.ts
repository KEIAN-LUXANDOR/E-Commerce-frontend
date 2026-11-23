import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const apiUrl = (process.env.API_URL ?? "https://api.keianluxlandor.in").replace(/\/+$/, "");
const apiOrigin = new URL(apiUrl).origin;
const frontendRoot = dirname(fileURLToPath(import.meta.url));

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
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.keianluxlandor.in" }],
        destination: "https://keianluxlandor.in/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API !== "false") return [];
    return [
      { source: "/api/:path*", destination: `${apiUrl}/api/v1/:path*` },
      // Product photos served by Spring Boot (/images/**) load from the same address as the website
      { source: "/images/:path*", destination: `${apiOrigin}/images/:path*` },
    ];
  },
  turbopack: {
    root: frontendRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
