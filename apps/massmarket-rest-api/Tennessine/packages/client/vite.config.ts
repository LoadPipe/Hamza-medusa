// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  test: {
    include: ["test/*.test.ts"],
    browser: {
      name: "chromium",
      provider: "playwright",
      headless: true,
      providerOptions: {
        launch: {
          // we should only add these in CI
          args: ["--no-sandbox", "--no-zygote"],
        },
      },
    },
  },
  plugins: [
    nodePolyfills({
      // Override the default polyfills for specific modules.
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: "memfs",
      },
    }),
  ],
});
