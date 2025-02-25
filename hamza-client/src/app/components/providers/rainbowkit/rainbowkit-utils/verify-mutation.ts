"use client"
import {useMutation} from '@tanstack/react-query';
import Cookies from 'js-cookie';
import {SiweMessage} from 'siwe';
import {getToken, recoverCart, clearCartCookie, clearAuthCookie} from '@/lib/server';
import {useCustomerAuthStore} from '@/zustand/customer-auth/customer-auth';
import axios from "axios";
import {usePublicClient} from "wagmi";
import {mainnet, sepolia} from 'wagmi/chains';
import {watchBlocks} from "@wagmi/core";
import {wagmiConfig} from "@/components/providers/rainbowkit/wagmi";

interface VerifyVariables {
    message: string;
    signature: string;
    clientWallet: string;  // pass in the user's wallet from outside
}

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG_URL = `${MEDUSA_SERVER_URL}/custom/verify`;

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


// Helper: Wait for a chain endpoint to be ready using AbortController.
// const waitForChain = async (
//     client: ReturnType<typeof usePublicClient>,
//     retries = 3,
//     delay = 1000,
//     timeout = 3000
// ) => {
//     if (!client) {
//         throw new Error('Public client is undefined');
//     }
//     // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/AbortController
//     for (let i = 0; i < retries; i++) {
//         // Create a new AbortController for this attempt
//         const controller = new AbortController();
//         // Set a timeout to abort the request after the specified time
//         const id = setTimeout(() => controller.abort(), timeout);
//         try {
//             // Cast to any because getBlockNumber's type doesn't include "signal"
//             const blockNumber = await client.getBlockNumber({ signal: controller.signal } as any);
//             // If block returns within our set time, clear the timer and return the block number...
//             clearTimeout(id);
//             return blockNumber;
//         } catch (error) {
//             clearTimeout(id);
//             // If this was the last retry, throw an error
//             if (i === retries - 1) {
//                 throw new Error('Chain endpoint not ready after retries');
//             }
//             // Otherwise, wait for a delay before retrying
//             await new Promise((resolve) => setTimeout(resolve, delay));
//         }
//     }
// };
//

/**
 * Helper: Wait for the next block event using the block watcher.
 * This sets up a one-time listener that unsubscribes as soon as a block is received.
 */
// async function waitForNextBlock(chainId: number): Promise<number> {
//     return new Promise((resolve, reject) => {
//         // Set up the block watcher using your central config.
//         const unwatch = watchBlocks(wagmiConfig, {
//             chainId,
//             onBlock: (blockNumber: number, prevBlock?: number) => {
//                 // Once a block is detected, unsubscribe and resolve the promise.
//                 unwatch();
//                 resolve(blockNumber);
//             },
//             onError: (error) => {
//                 unwatch();
//                 reject(error);
//             },
//         });
//     });
// }


export const useVerifyMutation = () => {
    const {setCustomerAuthData, setCustomerPreferredCurrency, setWhitelistConfig, /* etc */} =
        useCustomerAuthStore();

    // Declare chain clients using usePublicClient hook (must be inside a component wrapped in WagmiProvider)
    // const mainnetClient = usePublicClient({chainId: mainnet.id});
    // const sepoliaClient = usePublicClient({chainId: sepolia.id});

    // if you need to clear login:
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

    return useMutation({
        // 1 The core async logic from our old `verify()` function
        mutationFn: async ({message, signature, clientWallet}: VerifyVariables) => {
            // if (!isHydrated) { ... }

            // Wait for chain endpoints to be ready using our helper with AbortController.
            // const mainnetBlock = await waitForNextBlock(mainnetClient, 5000);
            // const sepoliaBlock = await waitForNextBlock(sepoliaClient, 5000);
            // console.log('Mainnet block:', mainnetBlock, 'Sepolia block:', sepoliaBlock);

            console.log('Starting verification request...');
            const parsedMessage = new SiweMessage(message);
            console.log('parsedMessage', parsedMessage);

            // First verify request
            let response = await sendVerifyRequest(message, signature);
            if (!response || !response.data) {
                console.error('No response from /verify.');
                throw new Error('No response from verify');
            }

            let data = response.data;
            console.log('data', data);

            // If "created" is true, do a second verify request
            if (data.status === true && data.data?.created === true) {
                console.log('Doing a second verify request...');
                const authResponse = await sendVerifyRequest(message, signature);
                if (!authResponse || !authResponse.data) {
                    console.error('No second response from /verify.');
                    throw new Error('No response from second verify');
                }
                data = authResponse.data;
            }

            if (data.status !== true) {
                console.log('running verify unauthenticated');
                // If you want to forcibly logout on error, do it in onError
                throw new Error(data.message);
            }

            console.log('Verification success from server side...');

            // Next, get your token from the server
            const tokenResponse = await getToken({
                wallet_address: parsedMessage.address.toLowerCase(),
                email: data.data?.email?.trim()?.toLowerCase(),
                password: '',
            });
            console.log('tokenResponse:', tokenResponse);

            // Check address mismatch
            const responseWallet = parsedMessage.address.toLowerCase() || '';
            const clientWalletTrimmed = clientWallet.trim().toLowerCase() || '';

            if (!responseWallet || !clientWalletTrimmed) {
                console.error('One or both wallet addresses are missing');
                throw new Error('Missing wallet address');
            }

            if (responseWallet !== clientWalletTrimmed) {
                console.error('Wallet address mismatch on login');
                throw new Error('Wallet address mismatch');
            }

            // If everything checks out, return all needed data to `onSuccess`
            return {
                tokenResponse,
                parsedMessage,
                data,
                customerId: data.data.customer_id,
            };
        },

        // 2. On success, we handle state updates, cookies, cart recovery, etc.
        onSuccess: async ({tokenResponse, parsedMessage, data, customerId}) => {
            console.log('✅ onSuccess after verifyMutation...');

            // (A) Set JWT cookie
            Cookies.set('_medusa_jwt', tokenResponse);

            // (B) Set store auth data
            setCustomerAuthData({
                token: tokenResponse,
                wallet_address: parsedMessage.address.toLowerCase(),
                customer_id: data.data?.customer_id,
                is_verified: data.data?.is_verified,
                status: 'authenticated',
            });

            // Set currency
            setCustomerPreferredCurrency(
                data.data?.preferred_currency?.code
            );

            // Set Whitelist
            setWhitelistConfig(data.data?.whitelist_config);

            // Attempt cart recovery
            try {
                console.log('recovering cart');
                await recoverCart(customerId);
            } catch (e) {
                console.log('Error recovering cart');
                console.error(e);
            }

            console.log('Finished onSuccess - user is now authenticated!');
        },

        // 3. On error, handle forced logout, clearing cookies, etc.
        onError: (error) => {
            console.error('Verification failed:', error);
            // If you want to forcibly logout on error:
            clearLogin();
            clearCartCookie();
        },
    });
};
