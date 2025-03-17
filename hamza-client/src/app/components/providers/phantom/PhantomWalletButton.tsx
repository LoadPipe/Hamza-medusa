'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function PhantomWalletButton() {
    return (
        <div className="wallet-button-wrapper">
            <WalletMultiButton />
        </div>
    );
}
