import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || "",
  },
  async rewrites() {
    const chatServerUrl = process.env.CHAT_SERVER_URL || "http://localhost:5000";
    return [
      {
        source: "/api/chat",
        destination: `${chatServerUrl}/api/chat`,
      },
      {
        source: "/api/health",
        destination: `${chatServerUrl}/api/health`,
      },
    ];
  },
};

export default nextConfig;
