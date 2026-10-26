import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // Month by month was merged into the financial model.
  async redirects() {
    return [
      { source: "/monthly", destination: "/model", permanent: false },
      // Tiers and pricing, and the timeline, were merged into the product page.
      { source: "/pricing", destination: "/product", permanent: false },
      { source: "/timeline", destination: "/product", permanent: false },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
