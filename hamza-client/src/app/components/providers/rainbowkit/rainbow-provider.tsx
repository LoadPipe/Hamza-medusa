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
import {
    clearAuthCookie,
    getCustomer,
    getHamzaCustomer,
    getToken,
    recoverCart
} from '@lib/data';
import { signOut } from '@modules/account/actions';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import useWishlistStore from '@store/wishlist/wishlist-store';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG_URL = `${MEDUSA_SERVER_URL}/custom/verify`;
const GET_NONCE_URL = `${MEDUSA_SERVER_URL}/custom/nonce`;

async function sendVerifyRequest(message: any, signature: any) {
    return await axios.post(VERIFY_MSG_URL,
        {
            message,
            signature,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-control': 'no-cache, no-store',
                Accept: 'application/json',
            }
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
        authData,
        setCustomerAuthData,
        setCustomerPreferredCurrency,
        setWhitelistConfig,
    } = useCustomerAuthStore();
    const router = useRouter();
    const [customer_id, setCustomerId] = useState('');
    //const [clientWallet, setClientWallet] = useState('');
    const { loadWishlist } = useWishlistStore((state) => state);

    let clientWallet = '';

    useEffect(() => {
        if (authData.status === 'authenticated' && customer_id) {
            loadWishlist(customer_id);
            router.refresh();
        }
    }, [authData.status, customer_id]); // Dependency array includes any state variables that trigger a reload

    useEffect(() => {
        getHamzaCustomer().then((hamzaCustomer) => {
            console.log('Hamza Customer: ', hamzaCustomer);
            getCustomer().then((customer) => {
                console.log('Medusa Customer: ', customer);
                if ((!customer || !hamzaCustomer) || customer?.id !== hamzaCustomer?.id) {
                    console.log('setting auth to unauthenticated');
                    setCustomerAuthData({
                        customer_id: '',
                        is_verified: false,
                        status: 'unauthenticated',
                        token: '',
                        wallet_address: '',
                    });
                    clearAuthCookie();
                }
            });
        });
        console.log(authData.wallet_address);
    }, [authData.wallet_address]);

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            const nonce = await getNonce();
            return nonce ?? '';
        },

        createMessage: ({ nonce, address, chainId }) => {
            console.log(
                `Creating message with nonce: ${nonce}, address: ${address}, chainId: ${chainId}`
            );
            console.log('setting client wallet to ', address);
            clientWallet = address;
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
                        email: data.data.email,
                        password: '',
                    });

                    //check that customer data and wallet address match 
                    if (data.data.wallet_address.trim().toLowerCase() === clientWallet?.trim()?.toLowerCase()) {
                        const customerId = data.data.customer_id;
                        setCustomerId(customerId);
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

                        try {
                            console.log('recovering cart');
                            recoverCart(customerId);
                        }
                        catch (e) {
                            console.log('Error recovering cart');
                            console.error(e);
                        }

                        return true;
                    }
                    else {
                        console.log('Wallet address mismatch on login');
                        console.log(data.data.wallet_address);
                        console.log(clientWallet);
                        console.log(message.address);
                        setCustomerAuthData({
                            ...authData,
                            status: 'unauthenticated',
                        });
                        clearAuthCookie();
                        return false;
                    }

                } else {
                    console.log('running verify unauthenticated');
                    setCustomerAuthData({
                        ...authData,
                        status: 'unauthenticated',
                    });
                    clearAuthCookie();
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
