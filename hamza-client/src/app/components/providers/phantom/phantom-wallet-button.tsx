'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { Login } from '@/components/providers/phantom/login';
import React from 'react';

export type ConnectedMethods =
    | {
          name: string;
          onClick: () => Promise<string>;
      }
    | {
          name: string;
          onClick: () => Promise<void>;
      };

interface Props {
    publicKey?: PublicKey;
    connectedMethods: ConnectedMethods[];
    connect: () => Promise<void>;
}

export default function PhantomWalletButton() {
    return (
        <div className="wallet-button-wrapper">
            <WalletMultiButton />
            <Login />
        </div>
    );
}
