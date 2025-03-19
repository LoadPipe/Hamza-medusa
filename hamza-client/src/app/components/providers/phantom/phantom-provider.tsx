'use client';

import React, { useMemo } from 'react';
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import ClientWalletProvider from '@/components/providers/phantom/ClientWalletProvider';
import { NETWORK } from './utils/endpoints';
import '@solana/wallet-adapter-react-ui/styles.css';

const ReactUIWalletModalProviderDynamic = dynamic(
    async () =>
        (await import('@solana/wallet-adapter-react-ui')).WalletModalProvider,
    { ssr: false }
);

export function PhantomProvider({ children }: { children: React.ReactNode }) {
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <ConnectionProvider endpoint={NETWORK}>
            <ClientWalletProvider wallets={wallets}>
                <ReactUIWalletModalProviderDynamic>
                    {children}
                </ReactUIWalletModalProviderDynamic>
            </ClientWalletProvider>
        </ConnectionProvider>
    );
}
