import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
