import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard/tickets",
        destination: "/dashboard/discord/tickets",
      },
      {
        source: "/dashboard/panels",
        destination: "/dashboard/discord/panels",
      },
      {
        source: "/dashboard/commands",
        destination: "/dashboard/discord/commands",
      },
      {
        source: "/dashboard/auto-replies",
        destination: "/dashboard/discord/auto-replies",
      },
      {
        source: "/dashboard/levels",
        destination: "/dashboard/discord/levels",
      },
      {
        source: "/dashboard/points",
        destination: "/dashboard/discord/points",
      },
      {
        source: "/dashboard/admin-points",
        destination: "/dashboard/discord/admin-points",
      },
      {
        source: "/dashboard/colors",
        destination: "/dashboard/discord/colors",
      },
      {
        source: "/dashboard/setup",
        destination: "/dashboard/discord/setup",
      },
    ];
  },
};

export default nextConfig;
