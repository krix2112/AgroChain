import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@agrochain/ui',
    '@agrochain/api',
    '@agrochain/store',
    '@agrochain/blockchain',
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.dirname(require.resolve('react/package.json')),
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      '@react-native-async-storage/async-storage': require.resolve('./src/mocks/async-storage.js'),
    };
    return config;
  },
};

export default nextConfig;
