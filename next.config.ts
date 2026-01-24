import type { NextConfig } from "next";

// Load runtime environment variables (generated during build)
try {
  require('./env-runtime');
} catch (error) {
  console.warn('⚠️  Runtime env file not found - using build-time env vars');
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
