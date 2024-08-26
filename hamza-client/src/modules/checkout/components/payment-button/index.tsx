'use client';
import { Cart } from '@medusajs/medusa';
import {
    IWalletPaymentHandler,
    FakeWalletPaymentHandler,
    MassmarketWalletPaymentHandler,
    SwitchWalletPaymentHandler,
    LiteSwitchWalletPaymentHandler,
    DirectWalletPaymentHandler,
} from './payment-handlers';
import { Button } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import ErrorMessage from '../error-message';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, WindowProvider, useWalletClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ethers, BigNumberish } from 'ethers';
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { clearCart } from '@lib/data';
import {
    getMassmarketPaymentAddress,
    getMasterSwitchAddress,
} from 'contracts.config';
import toast from 'react-hot-toast';

//TODO: we need a global common function to replace this
const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

type PaymentButtonProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

type CheckoutData = {
    order_id: string; //medusa order id
    cart_id: string; //medusa cart id
    wallet_address: string; //wallet address of store owner
    currency_code: string; //currency code
    amount: string; //medusa amount
    massmarket_amount: string; //massmarket amount
    massmarket_order_id: string; //keccak256 of cartId (massmarket)
    massmarket_ttl: number;
    orders: any[]; //medusa orders
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
    const completeCart = useCompleteCart(cart.id);
    const updateCart = useUpdateCart(cart.id);
    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
    const { data: walletClient, isError } = useWalletClient();
    const router = useRouter();
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect({
            connector: new InjectedConnector(),
        });

    // useEffect hook to check if connection status changes
    // if !isConnected, connect to wallet
    useEffect(() => {
        if (!isConnected) {
            if (openConnectModal) openConnectModal();
        }
    }, [openConnectModal, isConnected]);

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
        //TODO: MOVE TO INDEX.TS
        const response = await axios.get(`${MEDUSA_SERVER_URL}/custom/config`);
        return response.data?.checkout_mode?.trim()?.toUpperCase();
    };

    //displays error to user
    const displayError = (errMsg: string) => {
        setErrorMessage(errMsg);
        toast.error(errMsg);
    }

    /**
     * Sends the given payment data to the Switch by way of the user's connnected
     * wallet.
     * @param data
     * @returns {transaction_id, payer_address, escrow_contract_address, success }
     */
    const doWalletPayment = async (data: any) => {
        const checkoutMode = await getCheckoutMode();
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
                handler = new LiteSwitchWalletPaymentHandler();
                break;
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
            return await handler.doWalletPayment(
                provider,
                signer,
                chainId,
                data
            );
        } catch (e) {
            console.error('error has occured during transaction', e);
            displayError('Checkout was not completed.');
            setSubmitting(false);
        }
    };

    /**
     * Retrieves data from server that will be needed for checkout, including currencies,
     * amounts, wallet addresses, etc.
     * @param cartId
     * @returns
     */
    const retrieveCheckoutData = async (cartId: string) => {
        //TODO: MOVE TO INDEX.TS
        const response = await axios.get(
            `${MEDUSA_SERVER_URL}/custom/checkout?cart_id=${cartId}`
        );
        return response.status == 200 && response.data ? response.data : {};
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
            router.push(`/${countryCode}/order/confirmed/${orderId}?cart=${cartId}`);
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
        //retrieve data (cart id, currencies, amounts etc.) that will be needed for wallet checkout
        const data: CheckoutData = await retrieveCheckoutData(cartId);

        if (data) {
            //this sends the payment to the wallet for on-chain processing
            const output = await doWalletPayment(data);

            //finalize the checkout, if wallet payment was successful
            if (output?.success) {
                //TODO: MOVE TO INDEX.TS
                const response = await axios.post(
                    `${MEDUSA_SERVER_URL}/custom/checkout`,
                    {
                        cartProducts: JSON.stringify(cartRef.current),
                        cart_id: cartId,
                        transaction_id: output.transaction_id,
                        payer_address: output.payer_address,
                        escrow_contract_address: output.escrow_contract_address,
                    }
                );

                //TODO: examine response

                //country code needed for redirect (get before killing cart)
                const countryCode = process.env.NEXT_PUBLIC_FORCE_US_COUNTRY
                    ? 'us'
                    : cart.shipping_address?.country_code?.toLowerCase();

                //clear cart
                clearCart();

                //redirect to confirmation page
                redirectToOrderConfirmation(
                    data?.orders?.length ? data.orders[0].order_id : null,
                    cart.id,
                    countryCode
                );
            } else {
                setSubmitting(false);
                displayError(
                    output?.message
                        ? output.message
                        : 'Checkout was not completed.'
                );
                await cancelOrderFromCart();
            }
        } else {
            await cancelOrderFromCart();
            throw new Error('Checkout failed to complete.');
        }
    };

    const cancelOrderFromCart = async () => {
        try {
            //TODO: MOVE TO INDEX.TS
            let response = await axios.post(
                `${MEDUSA_SERVER_URL}/custom/cart/cancel`,
                { cart_id: cart.id }
            );
            return;
        } catch (e) {
            console.log('error in cancelling order ', e);
            return;
        }
    };

    /**
     * Handles the click of the checkout button
     * @returns
     */
    const handlePayment = async () => {
        try {
            setSubmitting(true);

            //here connect wallet and sign in, if not connected
            // causes bug when connected with mobile

            connect();

            updateCart.mutate(
                { context: {} },
                {
                    onSuccess: ({ }) => {
                        //this calls the CartCompletion routine
                        completeCart.mutate(void 0, {
                            onSuccess: async ({ data, type }) => {
                                //TODO: data is undefined
                                try {
                                    //this does wallet payment, and everything after
                                    completeCheckout(cart.id);
                                } catch (e) {
                                    console.error(e);
                                    setSubmitting(false);
                                    displayError(
                                        'Checkout was not completed'
                                    );
                                    await cancelOrderFromCart();
                                }
                            },
                            onError: async (e) => {
                                setSubmitting(false);
                                if (
                                    e.message?.indexOf('status code 401') >= 0
                                ) {
                                    displayError('Customer not whitelisted');
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
            console.error(e);
            setSubmitting(false);
            displayError('Checkout was not completed');
            await cancelOrderFromCart();
        }
    };

    return (
        <>
            <Button
                height="52px"
                color="white"
                backgroundColor={'primary.indigo.900'}
                className="mt-6 py-3 px-6 "
                isLoading={submitting}
                disabled={notReady}
                onClick={handlePayment}
                _hover={{
                    backgroundColor: 'white',
                    color: 'black',
                }}
            >
                Place Order: Crypto
            </Button>
            <ErrorMessage error={errorMessage} />
        </>
    );
};

export default PaymentButton;
