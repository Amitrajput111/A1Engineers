import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-ashy-ten-31.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
