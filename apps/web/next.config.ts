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
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },
};

export default nextConfig;