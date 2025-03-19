'use client';

import React from 'react';
import { BaseWalletMultiButton } from './BaseWalletMultiButton';
import type { ButtonProps } from './Button';
import dynamic from 'next/dynamic';

const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
} as const;

export default function PhantomWalletButton(props: ButtonProps) {
    return <BaseWalletMultiButton {...props} labels={LABELS} />;
}

// https://github.com/vercel/next.js/issues/49454#issuecomment-1830053413
export const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
