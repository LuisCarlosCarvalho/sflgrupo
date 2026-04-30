import type { NextConfig } from "next";
const WebpackObfuscator = require('webpack-obfuscator');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],

  typescript: {
    ignoreBuildErrors: true,
  },
  
  webpack: (config: any, { dev, isServer }: any) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          debugProtection: true,
          debugProtectionInterval: 4000,
          disableConsoleOutput: true
        }, [])
      );
    }
    return config;
  },
  // Habilitar compatibilidade com Webpack no Next.js 16
  turbopack: {},
};

export default nextConfig;
