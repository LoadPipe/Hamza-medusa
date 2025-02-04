'use client';
import React, { useState, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    AuthenticationStatus,
    AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { useWalletClient, WagmiConfig } from 'wagmi';
import {
    chains,
    config,
    darkThemeConfig,
    SwitchNetwork,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { HnsClient } from '@/web3/contracts/hns-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SiweMessage } from 'siwe';
import {
    clearAuthCookie,
    clearCartCookie,
    getCustomer,
    getHamzaCustomer,
    getToken,
    recoverCart,
} from '@lib/data';
import { signOut } from '@modules/account/actions';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import ProfileImage from '@/account/@dashboard/profile/profile-form/components/customer-icon/profile-image';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG_URL = `${MEDUSA_SERVER_URL}/custom/verify`;
const GET_NONCE_URL = `${MEDUSA_SERVER_URL}/custom/nonce`;

async function sendVerifyRequest(message: any, signature: any) {
    return await axios.post(
        VERIFY_MSG_URL,
        {
            message,
            signature,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-control': 'no-cache, no-store',
                Accept: 'application/json',
            },
        }
    );
}

async function getNonce() {
    //const response = await fetch(GET_NONCE_URL);
    //const data = await response.json();
    const output = await axios.get(GET_NONCE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-control': 'no-cache, no-store',
            Accept: 'application/json',
        },
    });

    return output?.data?.nonce ?? '';
}

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const {
        walletAddress,
        authData,
        setCustomerAuthData,
        setCustomerPreferredCurrency,
        setWhitelistConfig,
        setHnsAvatar,
        setHnsName,
    } = useCustomerAuthStore();
    const router = useRouter();
    const [customer_id, setCustomerId] = useState('');
    const { loadWishlist } = useWishlistStore((state) => state);

    let clientWallet = walletAddress;

    const hnsClient = new HnsClient(10);

    useEffect(() => {
        let retries = 0;
        const maxRetries = 2; // Set a max retry limit

        const getHnsClient = async () => {
            try {
                console.log('attempting to retrieve HNS name & avatar');
                const { name, avatar } =
                    await hnsClient.getNameAndAvatar(walletAddress);
                console.log('HNS name & avatar:', name, avatar);

                setHnsName(name);
                setHnsAvatar(avatar);
            } catch (err) {
                if (retries < maxRetries) {
                    retries++;
                    // console.log(
                    //     `Retrying to fetch HNS data. Retry count: ${retries}`
                    // );
                    setTimeout(getHnsClient, 1000); // Retry after 1 second
                } else {
                    console.error(
                        'Max retries reached. Could not connect to RPC.'
                    );
                }
            }
        };

        if (walletAddress && authData.status === 'authenticated') {
            getHnsClient();
        }
    }, [authData.status]);

    useEffect(() => {
        if (authData.status === 'authenticated' && customer_id) {
            loadWishlist(customer_id);
            router.refresh();
        }
    }, [authData.status, customer_id]); // Dependency array includes any state variables that trigger a reload

    const clearLogin = () => {
        console.log('CLEARING LOGIN');
        setCustomerAuthData({
            customer_id: '',
            is_verified: false,
            status: 'unauthenticated',
            token: '',
            wallet_address: '',
        });
        clearAuthCookie();
    };

    useEffect(() => {
        console.log('Saved wallet address', clientWallet);
        if (clientWallet?.length) {
            getHamzaCustomer().then((hamzaCustomer) => {
                getCustomer().then((customer) => {
                    if (
                        !customer ||
                        !hamzaCustomer ||
                        customer?.id !== hamzaCustomer?.id
                    ) {
                        console.log('Hamza Customer: ', hamzaCustomer);
                        console.log('Medusa Customer: ', customer);
                        clearLogin();
                    }
                });
            });
        }
        console.log(authData.wallet_address);
    }, [authData.wallet_address]);

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            const nonce = await getNonce();
            return nonce ?? '';
        },

        createMessage: ({ nonce, address, chainId }) => {
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce,
            });
            console.log('Message Created', message);
            return message;
        },

        getMessageBody: ({ message }) => {
            const preparedMessage = message.prepareMessage();
            return preparedMessage;
        },

        verify: async ({ message, signature }) => {
            try {
                console.log(
                    'Verifying message with signature:',
                    message,
                    signature
                );
                const response = await sendVerifyRequest(message, signature);

                let data = response.data;
                if (data.status == true && data.data?.created == true) {
                    //if just creating, then a second request is needed
                    const authResponse = await sendVerifyRequest(
                        message,
                        signature
                    );
                    data = authResponse.data;
                }

                if (data.status == true) {
                    const tokenResponse = await getToken({
                        wallet_address: message.address,
                        email: data.data?.email?.trim()?.toLowerCase(),
                        password: '',
                    });

                    //check that customer data and wallet address match
                    if (
                        data.data.wallet_address.trim().toLowerCase() ===
                        clientWallet?.trim()?.toLowerCase()
                    ) {
                        const customerId = data.data.customer_id;
                        setCustomerId(customerId);
                        Cookies.set('_medusa_jwt', tokenResponse);
                        //localStorage.setItem('_medusa_jwt', tokenResponse);

                        setCustomerAuthData({
                            token: tokenResponse,
                            wallet_address: message?.address,
                            customer_id: data.data?.customer_id,
                            is_verified: data.data?.is_verified,
                            status: 'authenticated',
                        });

                        setCustomerPreferredCurrency(
                            data.data?.preferred_currency?.code
                        );

                        setWhitelistConfig(data.data?.whitelist_config);

                        try {
                            console.log('recovering cart');
                            recoverCart(customerId);
                        } catch (e) {
                            console.log('Error recovering cart');
                            console.error(e);
                        }

                        return true;
                    } else {
                        console.log('Wallet address mismatch on login');
                        console.log(data.data?.wallet_address);
                        console.log(clientWallet);
                        console.log(message?.address);
                        clearLogin();
                        clearCartCookie();
                        return false;
                    }
                } else {
                    console.log('running verify unauthenticated');
                    clearLogin();
                    throw new Error(data.message);
                }

                return false;
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
            return;
        },
    });

    // ***Ensures data is not shared between different users and requests***
    // https://tanstack.com/query/v4/docs/framework/react/guides/ssr#using-hydration
    const queryClientRef = React.useRef<QueryClient>();

    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 2 * 60 * 1000, // ⏳ 2 min - Prevents unnecessary refetches, keeping data fresh
                    refetchOnWindowFocus: false, // Avoids re-fetching when switching tabs
                    refetchOnReconnect: true, // ✅ Ensures fresh data after reconnection
                    refetchOnMount: false, // 🚀 Prevents redundant fetches when remounting components
                    retry: 2, // 🔄 Retries failed queries twice before throwing an error
                },
                mutations: {
                    retry: 2, // 🔄 Retries mutations twice before failing (handles network issues)
                },
            },
        });
    }


    const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
        return <ProfileImage centered={true} />;
    };

    return (
        <div>
            <WagmiConfig config={config}>
                <QueryClientProvider client={queryClientRef.current}>
                    <RainbowKitAuthenticationProvider
                        adapter={walletSignature}
                        status={authData.status}
                    >
                        <RainbowKitProvider
                            avatar={CustomAvatar}
                            theme={darkThemeConfig}
                            chains={chains}
                            modalSize="compact"
                        >
                            {children}
                        </RainbowKitProvider>
                    </RainbowKitAuthenticationProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </WagmiConfig>
        </div>
    );
}
