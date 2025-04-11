'use client';
import { Cart } from '@medusajs/medusa';
import {
    IWalletPaymentHandler,
    FakeWalletPaymentHandler,
    MassmarketWalletPaymentHandler,
    DirectWalletPaymentHandler,
    EscrowWalletPaymentHandler,
    AsyncPaymentHandler,
} from './payment-handlers';
import { Box, Button, Divider, Flex, Text, Icon } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, WindowProvider, useWalletClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ethers } from 'ethers';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { clearCart, finalizeCheckout } from '@/lib/server';
import toast from 'react-hot-toast';
import { getServerConfig } from '@/lib/server/index';
import { getClientCookie } from '@lib/util/get-client-cookies';
import HamzaLogoLoader from '@/components/loaders/hamza-logo-loader';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import Spinner from '@/modules/common/icons/spinner';
import { MESSAGES } from './payment-message/message';
import { useCompleteCartCustom, cancelOrderFromCart } from './useCartMutations';
import { FaBitcoin } from 'react-icons/fa';
import { WalletPaymentResponse } from './payment-handlers/common';

//TODO: we need a global common function to replace this

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

type PaymentButtonProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

// Extend the Window interface
declare global {
    interface Window {
        ethereum?: WindowProvider;
    }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart }) => {
    const notReady =
        !cart ||
        !cart.shipping_address ||
        !cart.billing_address ||
        !cart.email ||
        (cart.shipping_methods?.length ?? 0) > 0;

    return <CryptoPaymentButton notReady={notReady} cart={cart} />;
};

const CryptoPaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    notReady: boolean;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
    const { data: walletClient, isError } = useWalletClient();
    const { isUpdatingCart } = useCartStore();
    const router = useRouter();
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect({
            connector: new InjectedConnector(),
        });

    useEffect(() => {
        const fetchChainId = async () => {
            if (walletClient) {
                try {
                    const chainId = await walletClient.getChainId();
                    console.log('Connected to Chain ID:', chainId);
                    console.log('walletClient data:', walletClient);
                } catch (error) {
                    console.error('Error fetching chain ID:', error);
                }
            }
        };

        fetchChainId();
    }, [walletClient]);

    // Get the prescribed checkout mode from the server
    const getCheckoutMode = async () => {
        const response: any = await getServerConfig();
        return response.checkout_mode?.trim()?.toUpperCase();
    };

    //displays error to user
    const displayError = (errMsg: string) => {
        setErrorMessage(errMsg);
        toast.error(errMsg);
    };

    /**
     * Sends the given payment data to the Switch by way of the user's connnected
     * wallet.
     * @param data
     * @returns {transaction_id, payer_address, escrow_contract_address, success }
     */
    const doWalletPayment = async (data: any) => {
        const checkoutMode = data?.checkout_mode;
        console.log('checkout mode is', checkoutMode);

        //select the right handler based on payment mode
        let handler: IWalletPaymentHandler = new FakeWalletPaymentHandler();
        switch (checkoutMode?.toUpperCase()) {
            case 'ASYNC':
                handler = new AsyncPaymentHandler();
                break;
            case 'MASSMARKET':
                handler = new MassmarketWalletPaymentHandler();
                break;
            case 'DIRECT':
                handler = new DirectWalletPaymentHandler();
                break;
            case 'SWITCH':
                //if (data?.orders[0]?.escrow_metadata?.version === '1.0') {
                handler = new EscrowWalletPaymentHandler();
                break;
            //}
            //handler = new LiteSwitchWalletPaymentHandler();
            //break;
        }

        try {
            //get chain id, provider, and signer to pass to handler
            let chainId;
            let signer: ethers.Signer | null = null;
            let provider: ethers.BrowserProvider | null = null;

            if (walletClient) {
                // console.log('WALLET CLIENT');
                chainId = await walletClient.getChainId();
                provider = new ethers.BrowserProvider(walletClient, chainId);
                signer = await provider.getSigner();
            } else {
                //TODO: get provider, chain id & signer from window.ethereum
                if (window.ethereum?.providers) {
                    provider = new ethers.BrowserProvider(
                        window.ethereum?.providers[0]
                    );
                    signer = await provider.getSigner();
                }
            }

            //get the handler to return value
            console.log('doing wallet payment');
            const output = await handler.doWalletPayment(
                provider,
                signer,
                chainId,
                data
            );

            return output;
        } catch (e) {
            console.error('error has occured during transaction', e);
            displayError('Error has occured during transaction');
            setSubmitting(false);
        }
    };

    /**
     * Redirects to order confirmation on successful checkout
     * @param orderId
     * @param countryCode
     */
    const redirectToOrderConfirmation = (
        orderId: string,
        cartId: string,
        countryCode: string
    ) => {
        //finally, if all good, redirect to order confirmation page
        if (orderId?.length) {
            router.push(
                `/${countryCode}/order/confirmed/${orderId}?cart=${cartId}`
            );
        }
    };

    /**
     * Redirects to payment processing page
     * @param cartId
     * @param countryCode
     */
    const redirectToPaymentProcessing = (
        cartId: string,
        fromCheckout: boolean = false,
        payWith: string = 'evm',
        showQrCode: boolean = false
    ) => {
        //finally, if all good, redirect to order confirmation page
        if (cartId?.length) {
            router.push(
                `/order/processing/${cartId}?paywith=${payWith}&openqrmodal=${showQrCode ? 'true' : 'false'}&checkout=${fromCheckout ? 'true' : 'false'}`
            );
        }
    };

    /**
     * Does most of checkout:
     * - sends payment to wallet
     * - updates orders & payments after successful wallet payment
     * - update inventory post-checkout
     * - clears the cart
     * - redirects to the order confirmation
     * @param cartId
     * @param chainId
     */
    const executeCheckout = async (
        paymentMode: string,
        cartId: string,
        chainId: string
    ) => {
        try {
            // Retrieve data (cart id, currencies, amounts, etc.) needed for wallet checkout
            //onst data: CheckoutData = await getCheckoutData(cartId);
            const checkoutData = await axios.get(
                `${MEDUSA_SERVER_URL}/custom/checkout`,
                {
                    params: { cart_id: cartId },
                    headers: {
                        Authorization: `${getClientCookie('_medusa_jwt')}`,
                    },
                }
            );
            const data = checkoutData.data;

            let output: WalletPaymentResponse | undefined = {
                chain_id: parseInt(chainId),
                transaction_id: '',
                payer_address: (await walletClient?.account.address) ?? '',
                success: true,
            };

            if (data) {
                if (paymentMode === 'wallet') {
                    // Send the payment to the wallet for on-chain processing
                    output = await doWalletPayment(data);
                    console.log('wallet payment output:', output);
                }

                // Finalize the checkout, if wallet payment was successful
                if (output?.success) {
                    console.log('finalizing checkout');
                    const response = await finalizeCheckout(
                        cartId,
                        output.transaction_id,
                        output.payer_address,
                        output.chain_id
                    );

                    // Country code needed for redirect (get before clearing the cart)
                    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
                        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
                        : cart.shipping_address?.country_code?.toLowerCase();

                    // Clear cart
                    await clearCart();

                    // Redirect to confirmation page
                    //if (response.status == 100) {
                    // TODO: here, reredirect to payment status page
                    //} else if (response.status == 200) {
                    if (data.checkout_mode === 'ASYNC') {
                        const payWith: string = 'evm';
                        const showQr: boolean = true;
                        console.log('redirecting to payments page');
                        redirectToPaymentProcessing(
                            cart.id,
                            true,
                            payWith,
                            showQr
                        );
                    } else {
                        console.log('redirecting to confirmation page');
                        redirectToOrderConfirmation(
                            data?.orders?.length
                                ? data.orders[0].order_id
                                : null,
                            cart.id,
                            countryCode
                        );
                    }
                    //}
                } else {
                    setLoaderVisible(false);
                    displayError(
                        output?.message
                            ? output.message
                            : 'Checkout was not completed.'
                    );
                    await cancelOrderFromCart(cartId);
                }
            } else {
                setLoaderVisible(false);
                await cancelOrderFromCart(cartId);
                throw new Error('Checkout failed to complete.');
            }
        } catch (error) {
            console.error(error);
            displayError('An error occurred during checkout.');
        } finally {
            setSubmitting(false);
        }
    };

    const { mutate: completeCart } = useCompleteCartCustom();
    /**
     * Handles the click of the checkout button
     * @returns
     */
    const handlePayment = async (paymentMode: string) => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        try {
            setSubmitting(true);
            setLoaderVisible(true);
            setErrorMessage('');
            const chainId =
                (await walletClient?.getChainId())?.toString() ?? '';

            await new Promise((resolve, reject) => {
                completeCart(
                    {
                        cartId: cart.id,
                        chainType: 'evm',
                        chainId,
                    },
                    {
                        onSuccess: async () => {
                            try {
                                console.log('Finalizing Checkout...');
                                await executeCheckout(
                                    paymentMode,
                                    cart.id,
                                    chainId
                                );
                                resolve(1);
                            } catch (e) {
                                console.error(e);
                                setSubmitting(false);
                                displayError('Checkout was not completed');
                                reject(e);
                            }
                        },
                        onError: async (e) => {
                            console.error('Error completing cart:', e);
                            setSubmitting(false);
                            displayError('Checkout was not completed');
                            reject(e);
                        },
                    }
                );
            });
        } catch (e) {
            console.error(e);
            displayError('Checkout was not completed');
            setLoaderVisible(false);
            await cancelOrderFromCart(cart.id);
        } finally {
            setSubmitting(false);
            setLoaderVisible(false);
        }
    };

    const searchParams = useSearchParams();
    const step = searchParams.get('step');
    const isCartEmpty = cart?.items.length === 0;
    const isMissingAddress = !cart?.shipping_address;
    const isMissingShippingMethod = cart?.shipping_methods?.length === 0;
    const disableButton =
        isCartEmpty ||
        isUpdatingCart ||
        (isMissingAddress && isMissingShippingMethod);

    const getButtonText = () => {
        if (isCartEmpty) return 'Add products to order';
        if (isMissingAddress) return 'Add address to order';
        if (isUpdatingCart) return <Spinner />;
        return 'Pay with Crypto Wallet';
    };

    return (
        <>
            {loaderVisible && <HamzaLogoLoader messages={MESSAGES} />}
            <Button
                borderRadius={'full'}
                height={{ base: '42px', md: '58px' }}
                opacity={1}
                color={'black'}
                _hover={{ opacity: 0.5 }}
                backgroundColor={'primary.green.900'}
                isLoading={submitting}
                isDisabled={disableButton}
                onClick={() => handlePayment('wallet')}
            >
                {getButtonText()}
            </Button>

            {process.env.NEXT_PUBLIC_PAY_WITH_BITCOIN === 'true' && (
                <>
                    <Flex alignItems="center" my="5px">
                        <Box flex="1">
                            <Divider borderColor="gray.500" />
                        </Box>
                        <Text mx="4" color="white">
                            OR
                        </Text>
                        <Box flex="1">
                            <Divider borderColor="gray.500" />
                        </Box>
                    </Flex>

                    <Button
                        borderRadius={'full'}
                        height={{ base: '42px', md: '58px' }}
                        opacity={1}
                        color={'black'}
                        _hover={{ opacity: 0.5 }}
                        backgroundColor={'white'}
                        isLoading={submitting}
                        isDisabled={disableButton}
                        onClick={() => handlePayment('direct')}
                    >
                        <Flex alignItems="center" gap={2}>
                            <Icon as={FaBitcoin} boxSize={7} color="#F7931A" />
                            Pay with Bitcoin
                        </Flex>
                    </Button>
                </>
            )}
        </>
    );
};

export default PaymentButton;
