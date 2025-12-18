import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    // Ensures TypeScript errors don't block production builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
