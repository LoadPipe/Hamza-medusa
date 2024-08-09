const { withStoreConfig } = require("./store-config")
const store = require("./store.config.json")

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withStoreConfig({
    features: store.features,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "http",
                hostname: "54.253.186.85",
            },
            {
                protocol: "http",
                hostname: "localhost:9000",
            },
            {
                protocol: "https",
                hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "medusa-server-testing.s3.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "cbu01.alicdn.com"
            },
            {
                protocol: "http",
                hostname: "cbu01.alicdn.com"
            },
            {
                protocol: "https",
                hostname: "images.hamza.biz",
            },
            {
                protocol: "https",
                hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
            },
        ],
    },
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))

module.exports = nextConfig
