import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@agrochain/ui',
    '@agrochain/api',
    '@agrochain/store',
    '@agrochain/blockchain',
  ],
};

export default nextConfig;
