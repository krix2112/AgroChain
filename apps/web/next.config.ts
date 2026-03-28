import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@agrochain/ui',
    '@agrochain/api',
    '@agrochain/store',
    '@agrochain/blockchain',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': require.resolve('./src/mocks/async-storage.js'),
    }
    return config
  }
};

export default nextConfig;
