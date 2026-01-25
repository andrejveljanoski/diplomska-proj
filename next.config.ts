import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Optimize build for lower memory usage
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', '@amcharts/amcharts5', 'lucide-react'],
    // Reduce memory during build
    webpackMemoryOptimizations: true,
  },
  // Optimize chunk splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            amcharts: {
              test: /[\\/]node_modules[\\/]@amcharts[\\/]/,
              name: 'amcharts',
              priority: 10,
            },
            default: false,
          },
        },
      };
    }
    return config;
  },
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
