/** @type {import('next').NextConfig} */
const nextConfig = {
    // ...existing config...
    async rewrites() {
        return [
            {
                source: '/anime-list/kind-:kind',
                destination: '/anime-list',
            },
            {
                source: '/anime-list/genre-:genre',
                destination: '/anime-list',
            },
            {
                source: '/anime-list/kind-:kind/genre-:genre',
                destination: '/anime-list',
            },
            {
                source: '/anime-list/:filters*',
                destination: '/anime-list',
            }
        ];
    },
};

module.exports = nextConfig;
