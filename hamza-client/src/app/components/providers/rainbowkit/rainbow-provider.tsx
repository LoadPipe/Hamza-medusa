'use client';
import React, { useState, useEffect, useRef } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { darkThemeConfig } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { HnsClient } from '@/web3/contracts/hns-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SiweMessage } from 'siwe';
import { createSiweMessage } from 'viem/siwe';

import {
    clearAuthCookie,
    clearCartCookie,
    getCustomer,
    getHamzaCustomer,
    getToken,
    recoverCart,
} from '@/lib/server';
import { signOut } from '@modules/account/actions';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import ProfileImage from '@/modules/common/components/customer-icon/profile-image';
import { wagmiConfig } from './wagmi';

// Constants
const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const API_ENDPOINTS = {
    verify: `${MEDUSA_SERVER_URL}/custom/verify`,
    nonce: `${MEDUSA_SERVER_URL}/custom/nonce`,
};

// API Helper Functions
const apiClient = {
    async verifyMessage(message: any, signature: any) {
        return await axios.post(
            API_ENDPOINTS.verify,
            { message, signature },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-control': 'no-cache, no-store',
                    Accept: 'application/json',
                },
            }
        );
    },

    async getNonce() {
        const response = await axios.get(API_ENDPOINTS.nonce, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-control': 'no-cache, no-store',
                Accept: 'application/json',
            },
        });
        return response?.data?.nonce ?? '';
    },
};

// Custom Hook for HNS Integration
const useHnsIntegration = (
    walletAddress: string,
    authStatus: string,
    setHnsName: Function,
    setHnsAvatar: Function
) => {
    useEffect(() => {
        if (!walletAddress || authStatus !== 'authenticated') return;

        const hnsClient = new HnsClient(10);
        let retries = 0;
        const maxRetries = 2;

        const getHnsData = async () => {
            try {
                const { name, avatar } =
                    await hnsClient.getNameAndAvatar(walletAddress);
                setHnsName(name);
                setHnsAvatar(avatar);
            } catch (err) {
                if (retries < maxRetries) {
                    retries++;
                    setTimeout(getHnsData, 1000);
                } else {
                    console.error(
                        'Max retries reached. Could not connect to RPC.'
                    );
                }
            }
        };

        getHnsData();
    }, [authStatus, walletAddress]);
};

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const {
        walletAddress,
        authData,
        isHydrated,
        setCustomerAuthData,
        setCustomerPreferredCurrency,
        setWhitelistConfig,
        setHnsAvatar,
        setHnsName,
    } = useCustomerAuthStore();

    const router = useRouter();
    const [customer_id, setCustomerId] = useState('');
    const { loadWishlist } = useWishlistStore((state) => state);
    const queryClientRef = useRef<QueryClient>();

    useHnsIntegration(walletAddress, authData.status, setHnsName, setHnsAvatar);

    // Handle wishlist loading
    useEffect(() => {
        if (authData.status === 'authenticated' && customer_id) {
            loadWishlist(customer_id);
            router.refresh();
        }
    }, [authData.status, customer_id]);

    const clearLogin = () => {
        setCustomerAuthData({
            customer_id: '',
            is_verified: false,
            status: 'unauthenticated',
            token: '',
            wallet_address: '',
        });
        clearAuthCookie();
    };

    // Customer verification
    useEffect(() => {
        if (!isHydrated || !walletAddress?.length) return;

        const verifyCustomer = async () => {
            const [hamzaCustomer, customer] = await Promise.all([
                getHamzaCustomer(),
                getCustomer(),
            ]);

            if (
                !customer ||
                !hamzaCustomer ||
                customer?.id !== hamzaCustomer?.id
            ) {
                clearLogin();
            }
        };

        verifyCustomer();
    }, [authData.wallet_address, isHydrated]);

    const walletSignature = createAuthenticationAdapter({
        getNonce: apiClient.getNonce,

        createMessage: ({ nonce, address, chainId }) => {
            return createSiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce,
            });
        },

        verify: async ({ message, signature }) => {
            try {
                const parsedMessage = new SiweMessage(message);
                const response = await apiClient.verifyMessage(
                    message,
                    signature
                );
                let data = response.data;

                if (data.status === true && data.data?.created === true) {
                    const authResponse = await apiClient.verifyMessage(
                        message,
                        signature
                    );
                    data = authResponse.data;
                }

                if (data.status === true) {
                    const tokenResponse = await getToken({
                        wallet_address: parsedMessage.address.toLowerCase(),
                        email: data.data?.email?.trim()?.toLowerCase(),
                        password: '',
                    });

                    const responseWallet = parsedMessage.address.toLowerCase();
                    const clientWalletTrimmed = walletAddress
                        ?.trim()
                        ?.toLowerCase();

                    if (!responseWallet || !clientWalletTrimmed) {
                        clearLogin();
                        clearCartCookie();
                        return false;
                    }

                    if (responseWallet === clientWalletTrimmed) {
                        const customerId = data.data.customer_id;
                        setCustomerId(customerId);
                        Cookies.set('_medusa_jwt', tokenResponse);

                        setCustomerAuthData({
                            token: tokenResponse,
                            wallet_address: parsedMessage.address.toLowerCase(),
                            customer_id: data.data?.customer_id,
                            is_verified: data.data?.is_verified,
                            status: 'authenticated',
                        });

                        setCustomerPreferredCurrency(
                            data.data?.preferred_currency?.code
                        );
                        setWhitelistConfig(data.data?.whitelist_config);

                        try {
                            await recoverCart(customerId);
                        } catch (e) {
                            console.error('Error recovering cart:', e);
                        }

                        return true;
                    }

                    clearLogin();
                    clearCartCookie();
                    return false;
                }

                clearLogin();
                throw new Error(data.message);
            } catch (e) {
                console.error('Error in signing in:', e);
                return false;
            }
        },

        signOut: async () => {
            setCustomerAuthData({
                ...authData,
                status: 'unauthenticated',
                token: '',
                wallet_address: '',
                customer_id: '',
                is_verified: false,
            });
            await signOut();
            router.replace('/');
        },
    });

    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 2 * 60 * 1000,
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: true,
                    refetchOnMount: false,
                    retry: 2,
                },
                mutations: {
                    retry: 2,
                },
            },
        });
    }

    const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => (
        <ProfileImage centered={true} />
    );

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClientRef.current}>
                <RainbowKitAuthenticationProvider
                    adapter={walletSignature}
                    status={authData.status}
                >
                    <RainbowKitProvider
                        avatar={CustomAvatar}
                        theme={darkThemeConfig}
                        modalSize="compact"
                    >
                        {children}
                    </RainbowKitProvider>
                </RainbowKitAuthenticationProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </WagmiProvider>
    );
}
