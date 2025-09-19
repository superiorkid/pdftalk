import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  logging: { fetches: { fullUrl: true } },
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
