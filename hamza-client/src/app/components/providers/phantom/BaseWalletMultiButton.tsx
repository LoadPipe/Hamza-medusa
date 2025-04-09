'use client';

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from 'react';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { BaseWalletConnectionButton } from './BaseWalletConnectionButton';
import type { ButtonProps } from './Button';
import { useWalletModal } from './useWalletModal';

import { Transaction } from '@solana/web3.js';
import { getTransactionToSign, verifySignedTransaction } from '@/lib/server';

type Props = ButtonProps & {
    labels: Omit<
        {
            [TButtonState in ReturnType<
                typeof useWalletMultiButton
            >['buttonState']]: string;
        },
        'connected' | 'disconnecting'
    > & {
        'copy-address': string;
        copied: string;
        'change-wallet': string;
        disconnect: string;
    };
};

export function BaseWalletMultiButton({ children, labels, ...props }: Props) {
    const { setVisible: setModalVisible } = useWalletModal();
    const {
        buttonState,
        onConnect,
        onDisconnect,
        publicKey,
        walletIcon,
        walletName,
    } = useWalletMultiButton({
        onSelectWallet() {
            setModalVisible(true);
        },
    });
    const { connected, signTransaction } = useWallet();
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hasSignedIn, setHasSignedIn] = useState(false);

    const ref = useRef<HTMLUListElement>(null);
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            setMenuOpen(false);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, []);

    useEffect(() => {
        // This needs to run when connected AND publicKey are both available
        if (connected && publicKey) {
            // Check if we have a stored authentication token
            const storedAuth = localStorage.getItem(`wallet-auth-${publicKey.toBase58()}`);
            if (storedAuth) {
                // If we have a stored token and the wallet is connected, consider them signed in
                setHasSignedIn(true);
            } else if (!hasSignedIn) {
                // Only trigger sign-in if we haven't signed in yet and don't have a stored token
                handleSignIn();
            }
        }
    }, [connected, publicKey, hasSignedIn]);

    // 1) The sign-in function
    const handleSignIn = useCallback(async () => {
        if (!publicKey || !signTransaction) {
            return;
        }
        try {
            // 2a) call backend for a transaction
            const resp = await getTransactionToSign(publicKey.toBase58());
            if (!resp) {
                return;
            }
            const txBase64 = resp;
            // decode
            const transactionBuffer = Buffer.from(txBase64, 'base64');
            const transaction = Transaction.from(transactionBuffer);

            // 2b) sign locally
            const signedTx = await signTransaction(transaction);
            const signedTxBase64 = signedTx.serialize().toString('base64');

            // 2c) verify on backend
            const verified = await verifySignedTransaction(signedTxBase64);

            if (verified) {
                setHasSignedIn(true);
                localStorage.setItem(`wallet-auth-${publicKey.toBase58()}`, 'true');

            } else {
            }
        } catch (err: any) {
            console.error(err);
        }
    }, [publicKey, signTransaction]);

    const content = useMemo(() => {
        if (children) {
            return children;
        } else if (publicKey) {
            const base58 = publicKey.toBase58();
            return base58.slice(0, 4) + '..' + base58.slice(-4);
        } else if (
            buttonState === 'connecting' ||
            buttonState === 'has-wallet'
        ) {
            return labels[buttonState];
        } else {
            return labels['no-wallet'];
        }
    }, [buttonState, children, labels, publicKey]);

    const handleDisconnect = useCallback(() => {
        if (onDisconnect) {
            onDisconnect();
            setHasSignedIn(false);

            if (publicKey) {
                localStorage.removeItem(`wallet-auth-${publicKey.toBase58()}`);
            }

            setMenuOpen(false);
        }
    }, [onDisconnect, publicKey]);

    return (
        <div className="wallet-adapter-dropdown">
            <BaseWalletConnectionButton
                {...props}
                aria-expanded={menuOpen}
                style={{
                    pointerEvents: menuOpen ? 'none' : 'auto',
                    ...props.style,
                }}
                onClick={() => {
                    switch (buttonState) {
                        case 'no-wallet':
                            setModalVisible(true);
                            break;
                        case 'has-wallet':
                            if (onConnect) {
                                onConnect();
                            }
                            break;
                        case 'connected':
                            setMenuOpen(true);
                            break;
                    }
                }}
                walletIcon={walletIcon}
                walletName={walletName}
            >
                {content}
            </BaseWalletConnectionButton>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${menuOpen && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                {publicKey ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                publicKey.toBase58()
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 500);
                        }}
                        role="menuitem"
                    >
                        {copied ? labels.copied : labels['copy-address']}
                    </li>
                ) : null}
                <li
                    className="wallet-adapter-dropdown-list-item"
                    onClick={() => {
                        setModalVisible(true);
                        setMenuOpen(false);
                    }}
                    role="menuitem"
                >
                    {labels['change-wallet']}
                </li>
                {onDisconnect && (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={handleDisconnect}
                        role="menuitem"
                    >
                        {labels.disconnect}
                    </li>
                )}
            </ul>
        </div>
    );
}
