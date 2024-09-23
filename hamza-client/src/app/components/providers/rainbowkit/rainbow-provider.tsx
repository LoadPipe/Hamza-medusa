'use client';
import { useState, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    AuthenticationStatus,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import {
    chains,
    config,
    darkThemeConfig,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { SiweMessage } from 'siwe';
import { getCustomer, getHamzaCustomer, getToken } from '@lib/data';
import { signOut } from '@modules/account/actions';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import useWishlistStore from '@store/wishlist/wishlist-store';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG = `${MEDUSA_SERVER_URL}/custom/verify`;
const GET_NONCE = `${MEDUSA_SERVER_URL}/custom/nonce`;

async function sendVerifyRequest(message: any, signature: any) {
    return await axios({
        method: 'post',
        data: {
            message,
            signature,
        },
        url: `${VERIFY_MSG}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
}

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const {
        authData,
        setCustomerAuthData,
        setCustomerPreferredCurrency,
        setWhitelistConfig,
    } = useCustomerAuthStore();
    const router = useRouter();
    const [customer_id, setCustomerId] = useState('');
    const { loadWishlist } = useWishlistStore((state) => state);

    useEffect(() => {
        if (authData.status === 'authenticated' && customer_id) {
            loadWishlist(customer_id);
            router.refresh();
        }
    }, [authData.status, customer_id]); // Dependency array includes any state variables that trigger a reload

    useEffect(() => {
        getCustomer().then((customer) => {
            console.log('CUSTOMER: ', customer);
            if (!customer) {
                console.log('setting auth to unauthenticated');
                setCustomerAuthData({
                    customer_id: '',
                    is_verified: false,
                    status: 'unauthenticated',
                    token: '',
                    wallet_address: '',
                });
                return;
            } else {
                getHamzaCustomer().then((hamzaCust) => {
                    console.log('hamza cust id:', hamzaCust?.id);
                    console.log(' cust id:', customer?.id);
                    if (!customer || (customer.id != hamzaCust?.id)) {
                        console.log('setting auth to unauthenticated');
                        setCustomerAuthData({
                            customer_id: '',
                            is_verified: false,
                            status: 'unauthenticated',
                            token: '',
                            wallet_address: '',
                        });
                        return;
                    }
                });
            }
        });
    }, [authData.wallet_address]);

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            console.log('FETCHING NONCE.....');
            const response = await fetch(GET_NONCE);
            const data = await response.json();
            console.log('NONCE DATA: ', data.nonce);
            return data?.nonce ?? '';
        },

        createMessage: ({ nonce, address, chainId }) => {
            console.log(
                `Creating message with nonce: ${nonce}, address: ${address}, chainId: ${chainId}`
            );
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
            console.log('Preparing message:', message);
            const preparedMessage = message.prepareMessage();
            console.log('Message prepared:', preparedMessage);
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
                        email: data.data.email,
                        password: '',
                    });
                    setCustomerId(data.data.customer_id);
                    console.log('token response is ', tokenResponse);
                    Cookies.set('_medusa_jwt', tokenResponse);
                    //localStorage.setItem('_medusa_jwt', tokenResponse);

                    setCustomerAuthData({
                        token: tokenResponse,
                        wallet_address: message.address,
                        customer_id: data.data.customer_id,
                        is_verified: data.data.is_verified,
                        status: 'authenticated',
                    });
                    setCustomerPreferredCurrency(
                        data.data.preferred_currency.code
                    );

                    setWhitelistConfig(data.data.whitelist_config);

                    return true;
                } else {
                    console.log('running verify unauthenticated');
                    setCustomerAuthData({
                        ...authData,
                        status: 'unauthenticated',
                    });
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

    return (
        <div>
            <WagmiConfig config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitAuthenticationProvider
                        adapter={walletSignature}
                        status={authData.status}
                    >
                        <RainbowKitProvider
                            theme={darkThemeConfig}
                            chains={chains}
                            modalSize="compact"
                        >
                            {children}
                        </RainbowKitProvider>
                    </RainbowKitAuthenticationProvider>
                </QueryClientProvider>
            </WagmiConfig>
        </div>
    );
}
