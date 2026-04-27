import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Devin's preview tunnel to access the dev server's font/HMR resources.
  allowedDevOrigins: [
    "*.devinapps.com",
    "*.vercel.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "localhost",
  ],
};

export default nextConfig;
