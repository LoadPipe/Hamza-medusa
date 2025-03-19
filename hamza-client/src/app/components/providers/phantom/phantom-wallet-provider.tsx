'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ConnectionProvider,
    useWallet,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import type { Adapter } from '@solana/wallet-adapter-base';
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolanaSignInInput } from '@solana/wallet-standard-features';
import axios from 'axios';
import { AutoConnectProvider, useAutoConnect } from './auto-connect-provider';
import { verifySignIn } from '@solana/wallet-standard-util';

export default function PhantomWalletProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { autoConnect } = useAutoConnect();
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    // We assume the wallet adapter now has the SIWS signIn method.
    const wallets = useMemo(
        () => [
            // manually add any legacy wallet adapters here
            // new UnsafeBurnerWalletAdapter(),
            new PhantomWalletAdapter(),
        ],
        [network]
    );

    const autoSignIn = useCallback(async (adapter: Adapter) => {
        if (!('signIn' in adapter)) return true;

        const input: SolanaSignInInput = {
            domain: window.location.host,
            address: adapter.publicKey
                ? adapter.publicKey.toBase58()
                : undefined,
            statement: 'Please sign in.',
        };
        const output = await adapter.signIn(input);

        if (!verifySignIn(input, output))
            throw new Error('Sign In verification failed!');

        return false;
    }, []);

    return (
        <AutoConnectProvider>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider
                    wallets={wallets}
                    autoConnect={autoConnect && autoSignIn}
                >
                    <WalletModalProvider>{children}</WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </AutoConnectProvider>
    );
}
