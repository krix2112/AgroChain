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
      // react: path.dirname(require.resolve('react/package.json')),
      // 'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      '@react-native-async-storage/async-storage': require.resolve('./src/mocks/async-storage.js'),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' http://localhost:5000 https:; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
