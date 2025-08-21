import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "", // Leave empty for default port
        pathname: "/**", //  Allow any path on this hostname
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dh5twxeqi/**", // Match your specific Cloudinary path
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dofyqpsar/**", // Match your specific Cloudinary path
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dofyqpsar/**", // Match your specific Cloudinary path
      },
    ],
  },
};

export default nextConfig;