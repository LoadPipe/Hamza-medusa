'use client';

import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export function Login() {
    const { publicKey, signTransaction } = useWallet();
    const [signState, setSignState] = React.useState<
        'initial' | 'loading' | 'success' | 'error'
    >('initial');

    // Reset state if wallet changes or disconnects
    useEffect(() => {
        setSignState('initial');
    }, [publicKey]);

    // Automatically request a signature when in the initial state
    useEffect(() => {
        async function sign() {
            if (publicKey && signTransaction && signState === 'initial') {
                setSignState('loading');
                const signToastId = toast.loading('Signing message...');

                try {
                    // Request signature transaction from the server
                    const createRes = await axios.post(
                        `${MEDUSA_SERVER_URL}/custom/sign/create`,
                        { publicKeyStr: publicKey.toBase58() },
                        {
                            headers: {
                                'Content-Type':
                                    'application/json; charset=UTF-8',
                            },
                        }
                    );

                    // To access the returned data:
                    const { tx: createTx } = createRes.data;
                    const tx = Transaction.from(
                        Buffer.from(createTx, 'base64')
                    );

                    // Request signature from wallet (this should trigger the popup)
                    const signedTx = await signTransaction(tx);

                    // Validate signed transaction via the server
                    const validateRes = await axios.post(
                        `${MEDUSA_SERVER_URL}/custom/sign/validate`,
                        { signedTx: signedTx.serialize().toString('base64') },
                        {
                            headers: {
                                'Content-type':
                                    'application/json; charset=UTF-8',
                            },
                        }
                    );
                    await validateRes.data;

                    setSignState('success');
                    toast.success('Message signed', { id: signToastId });
                } catch (error: any) {
                    setSignState('error');
                    toast.error(
                        'Error verifying wallet, please reconnect wallet',
                        {
                            id: signToastId,
                        }
                    );
                }
            }
        }
        sign();
    }, [signState, signTransaction, publicKey]);

    const onRetry = () => {
        setSignState('initial');
    };

    if (!publicKey) {
        return (
            <div className="text-center p-4">
                <p>Please connect your wallet to login.</p>
            </div>
        );
    }

    if (signState === 'loading') {
        return <p className="text-center p-4">Signing in...</p>;
    }

    if (signState === 'error') {
        return (
            <div className="text-center p-4">
                <p>Failed to sign in. Please verify your wallet manually.</p>
                <button onClick={onRetry} className="btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    if (signState === 'success') {
        return (
            <div className="text-center p-4">
                <p>Successfully signed in!</p>
            </div>
        );
    }

    return null;
}
