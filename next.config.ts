import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "gesp.pro" }],
        destination: "https://www.gesp.pro/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
