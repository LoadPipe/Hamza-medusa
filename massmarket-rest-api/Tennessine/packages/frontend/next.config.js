// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ["ipfs.io"],
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty");

    return config;
  },
};
