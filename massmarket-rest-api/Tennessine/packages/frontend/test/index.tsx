// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { RenderOptions, render } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";
import { config } from "../src/wagmi";
// type SetupClient = Partial<CreateConfigParameters> & {
//   walletClient?: WalletClient;
// };
export function setupConfig() {
  return config;
}

type ProvidersProps = {
  children: React.ReactNode;
  config?: any;
};
export function Providers({
  children,
  config = setupConfig(),
}: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";

// @ts-ignore
export type UserEvent = ReturnType<typeof userEvent.setup>;

// export { addressRegex, getMockWalletClient } from "./utils";
