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
        cart.shipping_methods.length < 1
            ? true
            : false;

    return <CryptoPaymentButton notReady={notReady} cart={cart} />;
};

// TODO: (For G) Typescriptify this function with verbose error handling
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
    const completeCart = useCompleteCart(cart.id);
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
                    // console.log('Connected to Chain ID:', chainId);
                    // console.log('walletClient data:', walletClient);
                } catch (error) {
                    console.error('Error fetching chain ID:', error);
                }
            }
        };

        fetchChainId();
    }, [walletClient]);

    const cartRef = useRef<
        Array<{ variant_id: string; reduction_quantity: number }>
    >(
        cart.items.map((item) => ({
            variant_id: item.variant_id,
            reduction_quantity: item.quantity, // or any logic to determine the reduction quantity
        }))
    );

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
                        window.ethereum?.providers[0]
                    );
                    signer = await provider.getSigner();
                }
            }

            //get the handler to return value
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

            if (data) {
                // Send the payment to the wallet for on-chain processing
                const output = await doWalletPayment(data);

                // Finalize the checkout, if wallet payment was successful
                if (output?.success) {
                    // TODO: MOVE TO INDEX.TS
                    await finalizeCheckout(
                        cartId,
                        output.transaction_id,
                        output.payer_address,
                        output.receiver_address,
                        output.escrow_address,
                        output.chain_id
                    );

                    // TODO: examine response

                    // Country code needed for redirect (get before clearing the cart)
                    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
                        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
                        : cart.shipping_address?.country_code?.toLowerCase();

                    // Clear cart
                    clearCart();

                    // Redirect to confirmation page
                    redirectToOrderConfirmation(
                        data?.orders?.length ? data.orders[0].order_id : null,
                        cart.id,
                        countryCode
                    );
                } else {
                    setLoaderVisible(false);
                    displayError(
                        output?.message
                            ? output.message
                            : 'Checkout was not completed.'
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
                }
            );
            setLoaderVisible(false);
            return response;
        } catch (e) {
            setLoaderVisible(false);
            console.log('error in cancelling order ', e);
            return;
        }
    };

    /**
     * Handles the click of the checkout button
     * @returns
     */
    const handlePayment = async () => {
        if (!isConnected) {
            if (openConnectModal) openConnectModal();
        } else {
            try {
                setSubmitting(true);
                setLoaderVisible(true);
                setErrorMessage('');

                updateCart.mutate(
                    { context: {} },
                    {
                        onSuccess: ({}) => {
                            //this calls the CartCompletion routine
                            completeCart.mutate(void 0, {
                                onSuccess: async ({ data, type }) => {
                                    //TODO: data is undefined
                                    try {
                                        //this does wallet payment, and everything after
                                        completeCheckout(cart.id);
                                    } catch (e) {
                                        setLoaderVisible(false);
                                        console.error(e);
                                        setSubmitting(false);
                                        displayError(
                                            'Checkout was not completed'
                                        );
                                        await cancelOrderFromCart();
                                    }
                                },
                                onError: async (e) => {
                                    setLoaderVisible(false);
                                    setSubmitting(false);
                                    console.error(e);
                                    if (
                                        e.message?.indexOf('status code 401') >=
                                        0
                                    ) {
                                        displayError(
                                            'Customer not whitelisted'
                                        );
                                    } else {
                                        displayError(
                                            'Checkout was not completed'
                                        );
                                    }

                                    //TODO: this is a really bad way to do this
                                    await cancelOrderFromCart();
                                },
                            });
                        },
                    }
                );

                return;
            } catch (e) {
                setLoaderVisible(false);
                console.error(e);
                setSubmitting(false);
                displayError('Checkout was not completed');
                await cancelOrderFromCart();
            }
        }
    };

    const searchParams = useSearchParams();
    const step = searchParams.get('step');
    const isCartEmpty = cart?.items.length === 0;
    const isMissingAddress = !cart?.shipping_address;
    const isMissingShippingMethod = cart?.shipping_methods?.length === 0;
    const disableButton =
        step !== 'review' ||
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
                    messages={[
                        'Processing order',
                        'Charging the flux capacitor',
                        'Running on caffeine and code',
                        'Double-checking everything twice',
                        'Getting things just right',
                        'Aligning all the stars',
                        'Calibrating awesomeness',
                        'Fetching some digital magic',
                        'Crossing the t’s and dotting the i’s',
                        'Waking up the hamsters on the wheel',
                        'Cooking up something great',
                        'Dusting off the keyboard',
                        'Wrangling code into shape',
                        'Consulting the manual (just kidding)',
                        'Building something epic',
                        'Gearing up for greatness',
                        'Rehearsing our victory dance',
                        'Making sure it’s perfect for you',
                        'Channeling good vibes into the code',
                        'Stretching out some last-minute bugs',
                        'Preparing the finishing touches',
                        'Wow this is taking a long time',
                        'Person, woman, man, camera... TV',
                        'What’s for dinner tonight?',
                        'Sending a message to the Mayor of Blockchain',
                        'Contacting the blockchain',
                        'Ein, zwei, drei',
                        'Finalizing your purchase',
                        'Preparing your receipt',
                        'Nearly done',
                        'Randomizing whimsical checkout messages',
                        'Preparing you a glass of maple syrup',
                        'Patience is the companion of wisdom',
                        'Have patience with all things but first of all with yourself',
                        'It’s nice to be able to buy normal stuff with crypto',
                        'Hamza was born in 2024',
                        'Reordering the punch-cards',
                        'Hacking the Gibson',
                        'Beuller.... Beuller',
                        'Waking up and choosing crypto',
                        '',
                        'Let there be light',
                        'dot dot dot',
                    ]}
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
