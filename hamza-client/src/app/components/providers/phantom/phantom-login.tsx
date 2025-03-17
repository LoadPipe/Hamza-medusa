'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function PhantomLogin() {
    const { publicKey, connected, signMessage } = useWallet();
    const [nonce, setNonce] = useState<string | null>(null);
    const [signed, setSigned] = useState<boolean>(false);

    const getNonceFromServer = async (): Promise<string> => {
        // Fetch a nonce from your backend endpoint
        const response = await fetch('/api/get-nonce');
        const data = await response.json();
        return data.nonce;
    };

    const handleLogin = async () => {
        if (!publicKey) return;
        // Retrieve nonce and store it
        const nonce = await getNonceFromServer();
        setNonce(nonce);
        // Create a message to sign
        const message = `Sign in with Phantom. Nonce: ${nonce}`;
        const encodedMessage = new TextEncoder().encode(message);
        // Ask Phantom to sign the message
        const signature = await signMessage(encodedMessage);
        // Send the signature and message back to your server for verification
        const verifyResponse = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicKey: publicKey.toBase58(),
                message,
                signature: Array.from(signature),
            }),
        });
        const result = await verifyResponse.json();
        if (result.success) {
            setSigned(true);
            // Handle successful login
        }
    };

    return (
        <div>
            <WalletMultiButton />
            {connected && !signed && (
                <button onClick={handleLogin}>Sign In with Phantom</button>
            )}
            {signed && <p>Successfully signed in!</p>}
        </div>
    );
}
