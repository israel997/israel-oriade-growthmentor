import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake large packages — only import what's actually used
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
