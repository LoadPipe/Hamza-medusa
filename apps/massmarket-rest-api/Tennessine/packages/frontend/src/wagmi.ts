// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, walletConnect, injected } from "wagmi/connectors";
import { hardhat } from "viem/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    coinbaseWallet({ appName: "masslbs" }),
    walletConnect({ projectId: "6c432edcd930e0fa2c87a8d940ae5b91" }),
    injected({ target: "metaMask" }),
  ],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
