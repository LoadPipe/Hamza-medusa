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
        ],
    },
});

console.log('next.config.js', JSON.stringify(module.exports, null, 2));

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(module.exports, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: 'hamza-labs',
    project: 'javascript-nextjs',

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
        enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
});
