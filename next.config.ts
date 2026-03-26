import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles all of this natively — no static export needed
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "wellcare-pharmacy-76524.web.app" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.apollo247.in" },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
