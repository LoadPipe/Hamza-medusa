'use client';
import { Cart, PaymentSession } from '@medusajs/medusa';

import { Button } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import ErrorMessage from '../error-message';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, WindowProvider, useWalletClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ITransactionOutput, IMultiPaymentInput } from 'web3';
import { MassmarketPaymentClient } from 'web3/massmarket-payment';
import { ethers, BigNumberish } from 'ethers';
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { clearCart } from '@lib/data';
import { getCurrencyPrecision } from 'currency.config';
import {
    getMassmarketPaymentAddress,
    getMasterSwitchAddress,
} from 'contracts.config';

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
                    console.log('Connected to Chain ID:', chainId);
                    console.log('walletClient data:', walletClient);
                } catch (error) {
                    console.error('Error fetching chain ID:', error);
                }
            }
        };

        fetchChainId();
    }, [walletClient]);

    const translateToNativeAmount = (order: any, chainId: number) => {
        const { amount, currency_code } = order;
        const precision = getCurrencyPrecision(currency_code, chainId);
        const adjustmentFactor = Math.pow(10, precision.native - precision.db);
        const nativeAmount = BigInt(amount) * BigInt(adjustmentFactor);
        return ethers.toBigInt(nativeAmount);
    };

    const createPaymentInput = async (
        data: any,
        payer: string,
        chainId: number
    ) => {
        if (data.orders) {
            const paymentInput: IMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                //o.amount = o.massmarket_amount; // translateToNativeAmount(o, chainId);
                const input: IMultiPaymentInput = {
                    currency: o.currency_code,
                    receiver: o.wallet_address,
                    payments: [
                        {
                            //id: ethers.toBigInt(
                            //    ethers.keccak256(ethers.toUtf8Bytes(o.order_id))
                            //),
                            id: o.massmarket_order_id,
                            payer: payer,
                            massmarketAmount: o.massmarket_amount,
                            currency: o.currency_code,
                            receiver: data.wallet_address,
                            massmarketOrderId: o.massmarket_order_id,
                            storeId: o.orders[0].store.massmarket_store_id,
                            chainId,
                            amount: o.amount,
                            orderId: o.id,
                            massmarketTtl: o.massmarket_ttl,
                        },
                    ],
                };
                paymentInput.push(input);
            });

            return paymentInput;
        }
        return [];
    };

    const cartRef = useRef<
        Array<{ variant_id: string; reduction_quantity: number }>
    >(
        cart.items.map((item) => ({
            variant_id: item.variant_id,
            reduction_quantity: item.quantity, // or any logic to determine the reduction quantity
        }))
    );

    // Get the PAYMENT_MODE from the server
    const getPaymentMode = async () => {
        const response = await axios.get(`${MEDUSA_SERVER_URL}/custom/config`);
        console.log(`getPaymentMode Response ${JSON.stringify(response.data)}`);
        return response.data ? response.data : null;
    };

    /**
     * Sends the given payment data to the Switch by way of the user's connnected
     * wallet.
     * @param data
     * @returns {transaction_id, payer_address, escrow_contract_address, success }
     */
    const doWalletPayment = async (data: any) => {
        console.log('DOES THIS RUN?');
        const paymentMode = await getPaymentMode();
        if (paymentMode.data) {
            console.log('PAYMENT MODE', paymentMode.data);
        }

        try {
            //get provider and such
            // const rawchainId = await window.ethereum?.request({
            //     method: 'eth_chainId',
            // });

            //get chain id
            if (walletClient) {
                console.log('walletClient Test', walletClient);

                // const chainId = parseInt(rawchainId ?? '', 16);
                const chainId = await walletClient.getChainId();
                const provider = new ethers.BrowserProvider(
                    walletClient,
                    chainId
                );
                const signer: ethers.Signer = await provider.getSigner();

                //create the contract client
                const escrow_contract_address = getMasterSwitchAddress(chainId);

                const tx = await signer.sendTransaction({
                    to: '0x5bacAdf2F9d9C62D2696f93ede5a22041a9AeE0D',
                    value: data.orders[0].amount,
                });

                console.log(tx);
                const transaction_id = tx.hash;
                const payer_address = await signer.getAddress();

                /*
                const paymentContractAddr =
                    getMassmarketPaymentAddress(chainId);
                const paymentClient: MassmarketPaymentClient =
                    new MassmarketPaymentClient(
                        provider,
                        signer,
                        paymentContractAddr,
                        escrow_contract_address
                    );

                console.log('payment address:', paymentContractAddr);
                console.log('escrow address:', escrow_contract_address);

                //create the inputs
                const paymentInput: IMultiPaymentInput[] =
                    await createPaymentInput(
                        data,
                        await signer.getAddress(),
                        chainId
                    );

                console.log('payment input: ', paymentInput);

                //send payment to contract
                const output = await paymentClient.pay(paymentInput);

                console.log(output);
                const transaction_id = output.transaction_id;
                const payer_address = output.receipt.from;
                */

                return {
                    transaction_id,
                    payer_address,
                    escrow_contract_address,
                    success:
                        transaction_id && transaction_id.length ? true : false,
                };
            } else {
                return {
                    transaction_id: '0x21',
                    payer_address: '0x32',
                    escrow_contract_address: '0x42',
                    success: true,
                };
            }
        } catch (e) {
            console.error('error has occured during transaction', e);
            setErrorMessage('Checkout was not completed.');
            setSubmitting(false);
        }

        return {};
    };

    /**
     * Retrieves data from server that will be needed for checkout, including currencies,
     * amounts, wallet addresses, etc.
     * @param cartId
     * @returns
     */
    const retrieveCheckoutData = async (cartId: string) => {
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
        countryCode: string
    ) => {
        //finally, if all good, redirect to order confirmation page
        if (orderId?.length) {
            router.push(`/${countryCode}/order/confirmed/${orderId}`);
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
        console.log('got checkout data', data);

        if (data) {
            //this sends the payment to the wallet for on-chain processing
            const output = await doWalletPayment(data);
            console.log(
                `${JSON.stringify(cartRef)} cartref ${cartRef.current} ${typeof cartRef.current}`
            );
            //finalize the checkout, if wallet payment was successful
            if (output.success) {
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

                console.log(response.status);
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
                    countryCode
                );
            } else {
                setSubmitting(false);
                setErrorMessage('Checkout was not completed.');
                await cancelOrderFromCart();
            }
        } else {
            await cancelOrderFromCart();
            throw new Error('Checkout failed to complete.');
        }
    };

    const cancelOrderFromCart = async () => {
        try {
            let response = await axios.get(
                `${MEDUSA_SERVER_URL}/custom/cancel-order/${cart.id}`
            );
            console.log(response);
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
                                    setErrorMessage(
                                        'Checkout was not completed'
                                    );
                                    await cancelOrderFromCart();
                                }
                            },
                            onError: async ({ }) => {
                                setSubmitting(false);
                                setErrorMessage('Checkout was not completed');
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
            setErrorMessage('Checkout was not completed');
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
