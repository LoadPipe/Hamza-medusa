'use client';
import React, {useState, useEffect} from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    AvatarComponent,
} from '@rainbow-me/rainbowkit';
import {WagmiProvider} from 'wagmi';
import {darkThemeConfig} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {HnsClient} from '@/web3/contracts/hns-client';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {SiweMessage} from 'siwe';
import {createSiweMessage} from 'viem/siwe';
import {useQuery, useSuspenseQuery} from '@tanstack/react-query';
import {
    clearAuthCookie,
    clearCartCookie,
    getCombinedCustomer, getCustomer, getHamzaCustomer,
    getToken,
    recoverCart,
} from '@/lib/server';
import {signOut} from '@modules/account/actions';
import {useCustomerAuthStore} from '@/zustand/customer-auth/customer-auth';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useRouter} from 'next/navigation';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import ProfileImage from '@/modules/common/components/customer-icon/profile-image';
import {wagmiConfig} from './wagmi';
import {useVerifyMutation} from './rainbowkit-utils/verify-mutation'

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG_URL = `${MEDUSA_SERVER_URL}/custom/verify`;
const GET_NONCE_URL = `${MEDUSA_SERVER_URL}/custom/nonce`;

// Lazy load the production version of the React Query Devtools
const ReactQueryDevtoolsProduction = React.lazy(() =>
    import('@tanstack/react-query-devtools/build/modern/production.js').then(
        (d) => ({
            default: d.ReactQueryDevtools,
        })
    )
);

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

// I guess this should also be wrapped in a useQuery...
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

export function RainbowWrapper({children}: { children: React.ReactNode }) {

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
                    refetchOnMount: false, // Prevents redundant fetches when remounting components
                    retry: 2, // 🔄 Retries failed queries twice before throwing an error
                },
                mutations: {
                    retry: 2, // 🔄 Retries mutations twice before failing (handles network issues)
                },
            },
        });
    }

    const verifyMutation = useVerifyMutation();

    const walletAddress = useCustomerAuthStore((state) => state.authData.wallet_address);
    const isAuthenticated = useCustomerAuthStore((state) => state.authData.status);
    const isHydrated = useCustomerAuthStore((state) => state.isHydrated);
    const setCustomerAuthData = useCustomerAuthStore((state) => state.setCustomerAuthData);


    // Using local storage
    useEffect(() => {
        localStorage.setItem('authData', JSON.stringify(isAuthenticated));
        console.log('Updated localStorage authData:', isAuthenticated);
    }, [isAuthenticated]);


    // Enabling devtools in build mode $ window.toggleDevtools()
    // TODO: I'm moving really fast here, and focusing on the bug, this should be removed and replaced with env variable
    const [showDevtools, setShowDevtools] = React.useState(false)

    useEffect(() => {
        window.toggleDevtools = () => setShowDevtools((old) => !old)
    }, [])


    const router = useRouter();
    // const [customer_id, setCustomerId] = useState('');
    // const {loadWishlist} = useWishlistStore((state) => state);

    // let clientWallet = walletAddress;

    // const hnsClient = new HnsClient(10);

    // useEffect(() => {
    //     // alert("USE EFFECT 1")
    //     let retries = 0;
    //     const maxRetries = 2; // Set a max retry limit
    //
    //     const getHnsClient = async () => {
    //         try {
    //             console.log('attempting to retrieve HNS name & avatar');
    //             const {name, avatar} =
    //                 await hnsClient.getNameAndAvatar(walletAddress);
    //             console.log('HNS name & avatar:', name, avatar);
    //
    //             setHnsName(name);
    //             setHnsAvatar(avatar);
    //         } catch (err) {
    //             if (retries < maxRetries) {
    //                 retries++;
    //                 setTimeout(getHnsClient, 1000); // Retry after 1 second
    //             } else {
    //                 console.error(
    //                     'Max retries reached. Could not connect to RPC.'
    //                 );
    //             }
    //         }
    //     };
    //
    //     if (walletAddress && authData.status === 'authenticated') {
    //         getHnsClient();
    //     }
    // }, [authData.status, isHydrated]);

    // useEffect(() => {
    //     if (!isHydrated) return;
    //
    //     // alert(`USE EFFECT 2 ${authData.status} ${customer_id} ${isHydrated}`)
    //     if (authData.status === 'authenticated' && customer_id) {
    //         loadWishlist(customer_id);
    //         router.refresh();
    //     }
    // }, [authData.status, customer_id, isHydrated]); // Dependency array includes any state variables that trigger a reload

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

    // // `getHamzaCustomer`
    // const {
    //     data: getHamzaCustomerData,
    //     isLoading: hamzaLoading,
    //     error: hamzaError,
    //     isSuccess: hamzaCustomerSuccess,
    // } = useQuery({
    //     queryKey: ['combinedCustomers', authData.wallet_address],
    //     queryFn: getCombinedCustomer,
    //     // enabled: authData.status === 'authenticated' && Boolean(authData.wallet_address?.length > 0),
    //     staleTime: 60 * 3 * 1000,
    //     gcTime: 0,
    // });


    // Ignore responses after unmount
    // Ensuring only valid requests update state
    // TODO: While this solution means we don't require API function changes, we should be implementing Signals in our Axios wrapper...
    useEffect(() => {
        let isMounted = true; // Prevent state updates after unmount

        console.log("Saved wallet address:", walletAddress);

        if (!walletAddress || !verifyMutation.isSuccess) return;

        Promise.all([getHamzaCustomer(), getCustomer()])
            .then(([hamzaCustomer, customer]) => {
                if (!isMounted) return; // Ignore outdated responses if component unmounted

                if (!customer || !hamzaCustomer || customer?.id !== hamzaCustomer?.id) {
                    clearLogin();
                }
            })
            .catch((error) => {
                console.error("Error fetching customer data:", error);
            });

        return () => {
            isMounted = false; // Cleanup function to prevent memory leaks
        };
    }, [walletAddress, verifyMutation.isSuccess]);


    const {
        data: nonceData,
        refetch: fetchNonce,
        // data, error, etc., if needed
    } = useQuery({
        queryKey: ['nonce'],
        queryFn: async () => {
            const output = await axios.get(GET_NONCE_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-control': 'no-cache, no-store',
                    Accept: 'application/json',
                },
            });
            // alert(output?.data?.nonce)
            return output.data.nonce;
        },
        // Set these to ensure you always get a fresh nonce
        staleTime: 0,
        gcTime: 0,
        enabled: false, // Disable automatic fetching
    });

    // useEffect(() => {
    //     console.log('Auth Data on mount:', authData);
    //     console.log('Is Hydrated:', isHydrated);
    // }, [authData, isHydrated]);

    useEffect(() => {
        console.log('Query enabled?', Boolean(walletAddress?.length > 0) && isHydrated);
    }, [walletAddress]);
    // }, [authData, isHydrated]);

    // useEffect(() => {
    //     // if (!isHydrated) return;
    //     if (hamzaLoading) {
    //         console.log('Hamza query is loading...');
    //         return;
    //     }
    //     if (hamzaCustomerSuccess) {
    //         console.log('Combined customer data:', getHamzaCustomerData);
    //     } else {
    //         console.error('Combined customer query failed or returned no data', { hamzaCustomerSuccess, getHamzaCustomerData });
    //     }
    // }, [hamzaCustomerSuccess, getHamzaCustomerData]);
    // // }, [hamzaCustomerSuccess, getHamzaCustomerData, isHydrated]);

    //
    // useEffect(() => {
    //     // if (!isHydrated) return
    //     if (hamzaLoading || !hamzaCustomerSuccess) return;
    //
    //     if (!hamzaCustomerSuccess || !getHamzaCustomerData) return;
    //     const {hamzaCustomer, medusaCustomer} = getHamzaCustomerData;
    //
    //     if (!hamzaCustomer || !medusaCustomer || hamzaCustomer.id !== medusaCustomer.id) {
    //         console.log('Mismatch found.... Clearing Login')
    //         clearLogin()
    //     }
    //
    // }, [hamzaCustomerSuccess, getHamzaCustomerData])
    //

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            const {data: nonce} = await fetchNonce();
            return nonce;
        },

        createMessage: ({nonce, address, chainId}) => {
            console.log(nonce, address, chainId);
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

        verify: async ({message, signature}) => {
            // Now use the mutation from the top level
            try {
                const siweMessage = new SiweMessage(message);
                const addressFromMessage = siweMessage.address.toLowerCase();
                await verifyMutation.mutateAsync({
                    message,
                    signature,
                    clientWallet: addressFromMessage, // assuming walletAddress from your store
                });
                return true;
            } catch (error) {
                console.error('Verification failed:', error);
                return false;
            }
        },

        signOut: async () => {
            alert('STOP')
            console.trace('signOut called');

            if (!isAuthenticated) {
                console.log("Preventing unnecessary logout - status still loading...");
                return;
            }
            if (verifyMutation.isPending) return
            // if (isHydrated) {
            setCustomerAuthData({
                status: 'unauthenticated',
                token: '',
                wallet_address: '',
                customer_id: '',
                is_verified: false,
            });
            await signOut();
            router.replace('/');
            return;
            // }
        },
    });


    const CustomAvatar: AvatarComponent = ({address, ensImage, size}) => {
        return <ProfileImage centered={true}/>;
    };

    return (
        <>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClientRef.current}>
                    <RainbowKitAuthenticationProvider
                        adapter={walletSignature}
                        status={isAuthenticated}
                    >
                        <RainbowKitProvider
                            avatar={CustomAvatar}
                            theme={darkThemeConfig}
                            modalSize="compact"
                        >
                            {children}
                        </RainbowKitProvider>
                    </RainbowKitAuthenticationProvider>
                    <ReactQueryDevtools initialIsOpen={false}/>
                    {showDevtools && (
                        <React.Suspense fallback={null}>
                            <ReactQueryDevtoolsProduction/>
                        </React.Suspense>
                    )}
                </QueryClientProvider>
            </WagmiProvider>
        </>
    );
}
