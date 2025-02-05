'use client';
import { Cart } from '@medusajs/medusa';
import {
    IWalletPaymentHandler,
    FakeWalletPaymentHandler,
    MassmarketWalletPaymentHandler,
    LiteSwitchWalletPaymentHandler,
    DirectWalletPaymentHandler,
    EscrowWalletPaymentHandler,
} from './payment-handlers';
import { Button } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import ErrorMessage from '../error-message';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, WindowProvider, useWalletClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ethers, BigNumberish } from 'ethers';
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { clearCart, finalizeCheckout, getCheckoutData } from '@lib/data';
import toast from 'react-hot-toast';
import { getServerConfig } from '@lib/data/index';
import { getClientCookie } from '@lib/util/get-client-cookies';
import HamzaLogoLoader from '@/components/loaders/hamza-logo-loader';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import Spinner from '@/modules/common/icons/spinner';
import { MESSAGES } from './payment-message/message';
// import { useUpdateCartCustom, useCompleteCartCustom, useCancelOrderCustom } from "./useCartMutations";
import { useMutation } from '@tanstack/react-query';

//TODO: we need a global common function to replace this



const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

type PaymentButtonProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

// Custom mutations for useCompleteCart
const useCompleteCartCustom = () => {
    return useMutation({
        mutationFn: async (cartId: string) => {
            if (!cartId) {
                throw new Error("Cart ID is required for completing checkout.");
            }

            console.log(`Completing cart with ID: ${cartId}`);

            const response = await axios.post(
                `${MEDUSA_SERVER_URL}/store/carts/${cartId}/complete`,
                {},
                {
                    headers: {
                        authorization: getClientCookie("_medusa_jwt"),
                    },
                }
            );
            return response.data;
        },
    });
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


    console.log(`1AHD IS THIS CART DATA?? ${JSON.stringify(cart)}`);

    return <CryptoPaymentButton notReady={notReady} cart={cart} />;
};

const CryptoPaymentButton = ({
                                 cart,
                                 notReady,
                             }: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    notReady: boolean;
}) => {
    console.log(`WHY ARE U NOT READY? ${notReady}`);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loaderVisible, setLoaderVisible] = useState(false);
    console.log(cart.id)
    // const completeCart = useCompleteCart(cart.id);
    const updateCart = useUpdateCart(cart.id);
    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
    const { data: walletClient, isError } = useWalletClient();
    const { isUpdating } = useCartStore();
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
        const checkoutMode = 'SWITCH'; //await getCheckoutMode();
        console.log('checkout mode is', checkoutMode);

        //select the right handler based on payment mode
        let handler: IWalletPaymentHandler = new FakeWalletPaymentHandler();
        switch (checkoutMode?.toUpperCase()) {
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
                        window.ethereum?.providers[0],
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
                data,
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
     * Does most of checkout:
     * - sends payment to wallet
     * - updates orders & payments after successful wallet payment
     * - update inventory post-checkout
     * - clears the cart
     * - redirects to the order confirmation
     * @param cartId
     */
    const completeCheckout = async (cartId: string) => {
        try {
            console.log(`DOES THIS RUN`)
            // Retrieve data (cart id, currencies, amounts, etc.) needed for wallet checkout
            //onst data: CheckoutData = await getCheckoutData(cartId);
            const checkoutData = await axios.get(
                `${MEDUSA_SERVER_URL}/custom/checkout`,
                {
                    params: { cart_id: cartId },
                    headers: {
                        Authorization: `${getClientCookie('_medusa_jwt')}`,
                    },
                },
            );
            const data = checkoutData.data;

            if (data) {
                // Send the payment to the wallet for on-chain processing
                const output = await doWalletPayment(data);
                console.log('wallet payment output:', output);

                // Finalize the checkout, if wallet payment was successful
                if (output?.success) {
                    // TODO: MOVE TO INDEX.TS
                    console.log('finalizing checkout');
                    await finalizeCheckout(
                        cartId,
                        output.transaction_id,
                        output.payer_address,
                        output.chain_id,
                    );

                    // TODO: examine response

                    // Country code needed for redirect (get before clearing the cart)
                    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
                        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
                        : cart.shipping_address?.country_code?.toLowerCase();

                    // Clear cart
                    //console.log('clearing cart');
                    await clearCart();

                    // Redirect to confirmation page
                    console.log('redirecting to confirmation page');
                    redirectToOrderConfirmation(
                        data?.orders?.length ? data.orders[0].order_id : null,
                        cart.id,
                        countryCode,
                    );
                } else {
                    setLoaderVisible(false);
                    displayError(
                        output?.message
                            ? output.message
                            : 'Checkout was not completed.',
                    );
                    await cancelOrderFromCart();
                }
            } else {
                setLoaderVisible(false);
                await cancelOrderFromCart();
                throw new Error('Checkout failed to complete.');
            }
        } catch (error) {
            console.error(error);
            displayError('An error occurred during checkout.');
        } finally {
            setSubmitting(false);
        }
    };

    const cancelOrderFromCart = async () => {
        try {
            setLoaderVisible(false);
            const response = await axios.post(
                `${MEDUSA_SERVER_URL}/custom/cart/cancel`,
                {
                    cart_id: cart.id,
                },
                {
                    headers: {
                        authorization: getClientCookie('_medusa_jwt'),
                    },
                },
            );
            setLoaderVisible(false);
            return response;
        } catch (e) {
            setLoaderVisible(false);
            console.log('error in cancelling order ', e);
            return;
        }
    };

    // Use custom mutations
    const { mutate: completeCart } = useCompleteCartCustom();
    /**
     * Handles the click of the checkout button
     * @returns
     */
    const handlePayment = async () => {
        console.log('isConnected?', isConnected);

        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        try {
            setSubmitting(true);
            setLoaderVisible(true);
            setErrorMessage('');

            console.log("Completing Cart...");
            await new Promise((resolve, reject) => {
                completeCart(cart.id, {
                    onSuccess: async () => {
                        try {
                            console.log("Finalizing Checkout...");
                            await completeCheckout(cart.id);
                            resolve(1);
                        } catch (e) {
                            console.error(e);
                            setSubmitting(false);
                            displayError("Checkout was not completed");
                            reject(e);
                        }
                    },
                    onError: async (e) => {
                        console.error("Error completing cart:", e);
                        setSubmitting(false);
                        displayError("Checkout was not completed");
                        reject(e);
                    },
                });
            });

        } catch (e) {
            console.error(e);
            displayError("Checkout was not completed");
            await cancelOrderFromCart();
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
        isUpdating ||
        (isMissingAddress && isMissingShippingMethod);

    const getButtonText = () => {
        if (isCartEmpty) return 'Add products to order';
        if (isMissingAddress) return 'Add address to order';
        if (isUpdating) return <Spinner />;
        return 'Confirm Order';
    };

    return (
        <>
            {loaderVisible && (
                <HamzaLogoLoader
                    messages={
                        MESSAGES
                    }
                />
            )}
            <Button
                borderRadius={'full'}
                height={{ base: '42px', md: '58px' }}
                opacity={1}
                color={'white'}
                _hover={{ opacity: 0.5 }}
                backgroundColor={'primary.indigo.900'}
                isLoading={submitting}
                isDisabled={disableButton}
                onClick={handlePayment}
            >
                {getButtonText()}
            </Button>
        </>
    );
};

export default PaymentButton;
