import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'nyaa.shikimori.one',
      'shikimori.one',
      'kawai.shikimori.one',
      'desu.shikimori.one',
      'dere.shikimori.one',
      'localhost',
      '127.0.0.1',
    ],
  },
  async rewrites() {
    return [
      // Проксирование API-запросов
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
      // Проксирование RSC-запросов (для Next.js 15 Server Components)
      {
        source: '/:path*',
        destination: 'http://localhost:8000/anime/:path*',
        has: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
