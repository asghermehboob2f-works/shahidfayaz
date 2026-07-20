import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./dev.db"],
  },
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3", "prisma"],
};

export default nextConfig;
