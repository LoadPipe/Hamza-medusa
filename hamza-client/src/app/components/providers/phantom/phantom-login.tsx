'use client';

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import type { Adapter } from '@solana/wallet-adapter-base';
import {
    SolanaSignInInput,
    SolanaSignInOutput,
} from '@solana/wallet-standard-features';

export default function PhantomLogin() {
    const { publicKey, connected } = useWallet();
    // We assume the wallet adapter now has the SIWS signIn method.
    const adapter = useWallet() as any;
    const [signed, setSigned] = useState<boolean>(false);
    const { setCustomerAuthData } = useCustomerAuthStore();
    const router = useRouter();

    // Auto SIWS sign-in flow callback
    const handleLogin = useCallback(
        async (adapter: Adapter) => {
            if (!('signIn' in adapter)) return true;

            if (!publicKey) return;
            // 1. Verify that the wallet supports the signIn method.
            // if (
            //     !('signIn' in adapter) ||
            //     typeof adapter.signIn !== 'function'
            // ) {
            //     throw new Error('Wallet does not support SIWS signIn');
            // }

            // 2. Fetch the SIWS sign-in input from the backend.
            //    This endpoint returns a SolanaSignInInput object.
            const input: SolanaSignInInput = await getNonce(true);

            // 3. Trigger the wallet's signIn method with the fetched input.
            const output = await adapter.signIn(input);

            // 4. Package input and output and send them to the backend for verification.
            const constructPayload = JSON.stringify({ input, output });
            const verifyResponse = await fetch('/custom/verify/phantom', {
                method: 'POST',
                body: constructPayload,
                headers: { 'Content-Type': 'application/json' },
            });
            const success = await verifyResponse.json();
            if (!success) throw new Error('Sign In verification failed!');
        },
        [adapter, publicKey, setCustomerAuthData, router]
    );
}
