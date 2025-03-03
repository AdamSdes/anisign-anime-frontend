import { type NextConfig } from 'next'
const { withNextIntl } = require('next-intl/plugin');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'desu.shikimori.one',
          pathname: '/system/animes/original/**',
        },
      ],
      //formats: ['webp', 'jpeg', 'png'],
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
  };

export default nextConfig;