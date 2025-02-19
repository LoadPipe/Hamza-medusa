const { withStoreConfig } = require('./store-config');
const store = require('./store.config.json');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withStoreConfig({
    features: store.features,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'http',
                hostname: '54.253.186.85',
            },
            {
                protocol: 'http',
                hostname: 'localhost:9000',
            },
            {
                protocol: 'https',
                hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'medusa-server-testing.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'images.hamza.biz',
            },
            {
                protocol: 'https',
                hostname: 'images.hamza.market',
            },
            {
                protocol: 'https',
                hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'cbu01.alicdn.com', //buckydrop
            },
            {
                protocol: 'https',
                hostname: 'img.alicdn.com', //buckydrop
            },
            {
                protocol: 'https',
                hostname: 'alpha.hamza.biz',
            },
            {
                protocol: 'https',
                hostname: 'alpha.hamza.market',
            },
            {
                protocol: 'https',
                hostname: 'nhci-aigc.oss-cn-zhangjiakou.aliyuncs.com', //buckydrop
            },
            {
                protocol: 'https',
                hostname: 'global-img-cdn.1688.com',
            },
            {
                protocol: 'https',
                hostname: 'static.snapchum.com',
            },
            {
                protocol: 'https',
                hostname: 'static.hamza.market',
            },
            {
                protocol: 'https',
                hostname: 'blog.hamza.market',
            },
            {
                protocol: 'http',
                hostname: 'crm.globetopper.com',
            },
            {
                protocol: 'http',
                hostname: 'crm.dev.globetopper.com',
            },
            {
                protocol: 'https',
                hostname: 'crm.globetopper.com',
            },
            {
                protocol: 'https',
                hostname: 'crm.dev.globetopper.com',
            },
            // Add blockchain logo domains
            {
                protocol: 'https',
                hostname: 'cryptologos.cc',
            },
            {
                protocol: 'https',
                hostname: 'etherscan.io',
            },
            {
                protocol: 'https',
                hostname: 'optimistic.etherscan.io',
            },
            {
                protocol: 'https',
                hostname: 'arbiscan.io',
            },
            {
                protocol: 'https',
                hostname: 'basescan.org',
            },
            {
                protocol: 'https',
                hostname: 'polygonscan.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/us/:path*',
                destination: '/en/:path*', // Matches the entire path and redirects to /en/
                permanent: true, // Use a 301 redirect for SEO
            },
        ];
    },
});

console.log('next.config.js', JSON.stringify(module.exports, null, 2));

module.exports = nextConfig;
