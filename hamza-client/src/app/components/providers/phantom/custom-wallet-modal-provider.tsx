'use client';

import React, { useMemo } from 'react';
import { WalletModalContext } from './useWalletModal';
import { useWalletModal as useSolanaWalletModal } from '@solana/wallet-adapter-react-ui';

export function CustomWalletModalProvider({ children }: { children: React.ReactNode }) {
    // Get the Solana modal context
    const { visible, setVisible } = useSolanaWalletModal();

    // Create a context value that uses the Solana modal system
    const value = useMemo(
        () => ({
            visible,
            setVisible,
        }),
        [visible, setVisible]
    );

    return (
        <WalletModalContext.Provider value={value}>
            {children}
        </WalletModalContext.Provider>
    );
}