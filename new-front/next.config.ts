import { type NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ['ru', 'uk'],
        defaultLocale: 'ru',
    },
    srcDir: 'src',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'desu.shikimori.one',
                pathname: '/system/animes/original/**',
            },
        ],
    },
}

export default nextConfig;