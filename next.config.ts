import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows ALL https images — perfect for news apps
      },
    ],},
  reactCompiler: true,
};

export default nextConfig;
