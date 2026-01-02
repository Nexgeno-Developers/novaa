import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dh5twxeqi/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dh5twxeqi/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dofyqpsar/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dofyqpsar/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Optimize images for better performance
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    // Optimize image quality for better compression
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add quality parameter for better compression
    unoptimized: false,
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Add headers for caching static assets
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
      {
        // Cache static assets
        source: "/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache CSS and JS
        source: "/:path*\\.(css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle Fabric.js canvas dependency
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
