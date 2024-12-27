// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "../wagmi";
import { MyContextProvider } from "../context/MyContext";
import { StoreContextProvider } from "../context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { MerchantProvider } from "@/context/MerchantContext";

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MyContextProvider>
            <StoreContextProvider>
              <MerchantProvider>{props.children}</MerchantProvider>
            </StoreContextProvider>
          </MyContextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
