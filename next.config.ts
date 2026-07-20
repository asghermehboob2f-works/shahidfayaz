import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./dev.db"],
    },
    serverComponentsExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3", "prisma"],
  },
};

export default nextConfig;
