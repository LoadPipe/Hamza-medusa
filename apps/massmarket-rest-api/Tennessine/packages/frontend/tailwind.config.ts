// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      padding: {
        "under-nav": "80px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "button-gradient-start": "#57229F",
        "button-gradient-end": "#5A89E3",
        "primary-button": "#000",
        "remove-button": "#F04F62",
        "primary-gray": "#777777",
        "primary-blue": "#5794F7",
      },

      fontFamily: {
        proto: ["JetBrainsMono", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
