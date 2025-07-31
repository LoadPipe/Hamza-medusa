'use client';

import { Cart, Customer } from '@medusajs/medusa';
import { useToggleState } from '@medusajs/ui';
import {
    IWalletPaymentHandler,
    FakeWalletPaymentHandler,
    MassmarketWalletPaymentHandler,
    DirectWalletPaymentHandler,
    EscrowWalletPaymentHandler,
    AsyncPaymentHandler,
} from './payment-handlers';
import {
    Box,
    Button,
    Divider,
    Flex,
    Text,
    Icon,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, WindowProvider, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { clearCart, finalizeCheckout, setCurrency } from '@/lib/server';
import toast from 'react-hot-toast';
import { getClientCookie } from '@lib/util/get-client-cookies';
import HamzaLogoLoader from '@/components/loaders/hamza-logo-loader';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import Spinner from '@/modules/common/icons/spinner';
import { MESSAGES } from './payment-message/message';
import { useCompleteCartCustom, cancelOrderFromCart } from './useCartMutations';
import { FaBitcoin, FaWallet } from 'react-icons/fa';
import {
    checkWalletBalance,
    WalletPaymentResponse,
} from './payment-handlers/common';
import ChainSelectionInterstitial from '../chain-selector';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { getCurrencyPrecision } from '@/currency.config';
import { isShippingAddressRequired } from '@/modules/checkout/utils';
import AddressModal from '@/modules/checkout/components/address-modal';
import compareAddresses from '@lib/util/compare-addresses';

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

    return <CryptoPaymentButton cart={cart} />;
};

const CryptoPaymentButton = ({
    cart,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [selectedChain, setSelectedChain] = useState<{
        id: number;
        name: string;
    } | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddressModalOpen, onOpen: onAddressModalOpen, onClose: onAddressModalClose } = useDisclosure();
    const [addressType, setAddressType] = useState<'add' | 'edit'>('add');
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const { isUpdatingCart } = useCartStore();
    const { setIsProcessingOrder } = useCartStore();
    const router = useRouter();

    const {
        preferred_currency_code,
        setCustomerPreferredCurrency,
        authData,
        setCustomerAuthData,
    } = useCustomerAuthStore();

    const { toggle: toggleSameAsBilling } = useToggleState(
        cart?.shipping_address && cart?.billing_address
            ? compareAddresses(cart?.shipping_address, cart?.billing_address)
            : true
    );

    useEffect(() => {
        const fetchChainId = async () => {
            if (walletClient) {
                try {
                    await walletClient.getChainId();
                } catch (error) {
                    console.error('Error fetching chain ID:', error);
                }
            }
        };

        fetchChainId();
    }, [walletClient]);

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
    const doWalletPayment = async (data: any): Promise<WalletPaymentResponse | undefined> => {
        const checkoutMode = data?.checkout_mode;

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
                handler = new EscrowWalletPaymentHandler();
                break;
        }

        try {
            //get chain id, provider, and signer to pass to handler
            let chainId;
            let signer: ethers.Signer | null = null;
            let provider: ethers.BrowserProvider | null = null;

            if (walletClient) {
                chainId = await walletClient.getChainId();
                provider = new ethers.BrowserProvider(walletClient, chainId);
                signer = await provider.getSigner();
            } else {
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
                selectedChain?.id || chainId,
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
            setIsProcessingOrder(false);
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
        showQrCode: boolean = false,
        paymentMode: string = ''
    ) => {
        //finally, if all good, redirect to order confirmation page
        if (cartId?.length) {
            setIsProcessingOrder(false);
            router.push(
                `/order/processing/${cartId}?paywith=${payWith}&openqrmodal=${showQrCode ? 'true' : 'false'}&checkout=${fromCheckout ? 'true' : 'false'}&paymentmode=${paymentMode}`
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
        chainType: string,
        chainId: string,
        cartId: string
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
                payer_address: walletClient?.account.address ?? '',
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
                    await finalizeCheckout(
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

                    // Redirect to confirmation page
                    //if (response.status == 100) {
                    // TODO: here, reredirect to payment status page
                    //} else if (response.status == 200) {
                    if (data.checkout_mode === 'ASYNC') {
                        const payWith: string = chainType;
                        const showQr: boolean = paymentMode === 'direct';
                        console.log('redirecting to payments page');
                        redirectToPaymentProcessing(
                            cart.id,
                            true,
                            payWith,
                            showQr,
                            paymentMode
                        );
                    } else {
                        await clearCart();

                        console.log('redirecting to confirmation page');
                        redirectToOrderConfirmation(
                            data?.orders?.length
                                ? data.orders[0].order_id
                                : null,
                            cart.id,
                            countryCode
                        );
                    }
                } else {
                    setLoaderVisible(false);
                    setIsProcessingOrder(false);
                    displayError(
                        output?.message
                            ? output.message
                            : 'Checkout was not completed.'
                    );
                    await cancelOrderFromCart(cartId);
                }
            } else {
                setLoaderVisible(false);
                setIsProcessingOrder(false);
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
     * Handles the selection of a chain from the interstitial
     * @param chainId
     * @param chainName
     */
    const handleChainSelect = (chainId: number, chainName: string) => {
        setSelectedChain({ id: chainId, name: chainName });
        proceedWithPayment('direct', 'evm', chainId.toString());
        onClose();
    };

    const proceedWithPayment = async (
        paymentMode: string,
        chainType: string,
        chainIdOverride?: string
    ) => {
        try {
            setSubmitting(true);
            setLoaderVisible(true);
            setIsProcessingOrder(true);
            setErrorMessage('');

            //TODO: have a better way to decide what bitcoin network to be on
            const chainId =
                chainIdOverride ||
                (chainType === 'evm'
                    ? (await walletClient?.getChainId())?.toString() ?? ''
                    : process.env.NEXT_PUBLIC_BITCOIN_NETWORK ?? 'testnet');

            await new Promise((resolve, reject) => {
                completeCart(
                    {
                        cartId: cart.id,
                        chainType,
                        chainId,
                    },
                    {
                        onSuccess: async () => {
                            try {
                                console.log('Finalizing Checkout...');
                                await executeCheckout(
                                    paymentMode,
                                    chainType,
                                    chainId,
                                    cart.id
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
            setIsProcessingOrder(false);
            await cancelOrderFromCart(cart.id);
        } finally {
            setSubmitting(false);
            setLoaderVisible(false);
            setIsProcessingOrder(false);
        }
    };

    const switchToBitcoin = async () => {
        try {
            setCustomerPreferredCurrency('btc');
            await setCurrency('btc', authData.customer_id, cart.id);
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    const handleDirectBitcoinPayment = async () => {
        await switchToBitcoin();
        await handlePaymentOrAddress('direct', 'bitcoin');
    };

    const handleAddAddress = () => {
        setAddressType('add');
        onAddressModalOpen();
    };

    const handlePaymentOrAddress = async (paymentMode: string, chainType: string) => {
        // If missing address, open address modal instead of processing payment
        if (isMissingAddress) {
            handleAddAddress();
            return;
        }

        // Otherwise, proceed with normal payment flow
        await handlePayment(paymentMode, chainType);
    };

    const handlePayment = async (paymentMode: string, chainType: string) => {
        if (paymentMode != 'direct') {
            if (!isConnected || authData.anonymous) {
                setCustomerAuthData({
                    wallet_address: '',
                    customer_id: '',
                    anonymous: false,
                    is_verified: false,
                    token: '',
                    status: 'unauthenticated',
                });
                openConnectModal?.();
                return;
            }
        }

        // For direct EVM payments, open the chain selection interstitial
        if (paymentMode === 'direct' && chainType === 'evm') {
            onOpen(); // Open the chain selection modal
            return;
        }

        // For other payment types, proceed directly
        await proceedWithPayment(paymentMode, chainType);
    };

    const isMissingShippingAddress = (cart: any) => {
        //if no shipping address, then definitely it's missing
        if (!cart.shipping_address) return true;

        //if shipping address is required, then we have to have the full address
        if (isShippingAddressRequired(cart)) {
            if (
                !cart.shipping_address.first_name ||
                !cart.shipping_address.last_name ||
                !cart.shipping_address.address_1 ||
                !cart.shipping_address.city ||
                !cart.shipping_address.postal_code ||
                !cart.shipping_address.country_code
            ) {
                return true;
            }
        }

        //email is always required
        console.log('cart email is', cart.email);
        return cart.email?.length ? false : true;
    };

    const isCartEmpty = cart?.items.length === 0;
    const isMissingAddress = isMissingShippingAddress(cart);
    const isMissingShippingMethod = cart?.shipping_methods?.length === 0;
    const disableButton =
        isCartEmpty ||
        isUpdatingCart ||
        (isMissingShippingMethod && !isMissingAddress);

    const getButtonText = () => {
        if (isCartEmpty) return 'Add products to order';
        if (isMissingAddress) return 'Add address to order';
        if (isUpdatingCart) return <Spinner />;
        if (authData.anonymous) return 'Connect Wallet';
        return 'Pay with Browser Wallet';
    };

    const payWithBitcoinEnabled =
        process.env.NEXT_PUBLIC_PAY_WITH_BITCOIN === 'true';

    return (
        <>
            {loaderVisible && <HamzaLogoLoader messages={MESSAGES} />}
            {/* Chain Selection Interstitial */}
            <ChainSelectionInterstitial
                isOpen={isOpen}
                onClose={onClose}
                onChainSelect={handleChainSelect}
            />

            {(preferred_currency_code === 'btc'
                ? getButtonText() !== 'Pay with Browser Wallet'
                : true) && (
                    <>
                        <Button
                            borderRadius={'full'}
                            height={{ base: '42px', md: '58px' }}
                            opacity={1}
                            color={'black'}
                            _hover={{ opacity: 0.5 }}
                            backgroundColor={'primary.green.900'}
                            isLoading={submitting}
                            isDisabled={disableButton}
                            onClick={() => handlePaymentOrAddress('wallet', 'evm')}
                        >
                            {getButtonText()}
                        </Button>
                    </>
                )}

            {payWithBitcoinEnabled && preferred_currency_code === 'btc' && (
                <Button
                    borderRadius={'full'}
                    height={{ base: '42px', md: '58px' }}
                    opacity={1}
                    color={'white'}
                    _hover={{ opacity: 0.5 }}
                    backgroundColor={'#242424'}
                    isLoading={submitting}
                    isDisabled={disableButton}
                    onClick={() => handleDirectBitcoinPayment()}
                >
                    <Flex alignItems="center" gap={2}>
                        <Icon as={FaBitcoin} boxSize={7} color="#F7931A" />
                        Pay with Bitcoin
                    </Flex>
                </Button>
            )}

            {payWithBitcoinEnabled && preferred_currency_code !== 'btc' && (
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
                </>
            )}

            {preferred_currency_code !== 'btc' && (
                <Button
                    borderRadius={'full'}
                    height={{ base: '42px', md: '58px' }}
                    opacity={1}
                    color={'white'}
                    _hover={{ opacity: 0.5 }}
                    backgroundColor={'#242424'}
                    isLoading={submitting}
                    isDisabled={disableButton}
                    onClick={() => handlePaymentOrAddress('direct', 'evm')}
                >
                    <Flex alignItems="center" gap={2}>
                        <Icon as={FaWallet} boxSize={5} color="white" />
                        Pay with External Wallet
                    </Flex>
                </Button>
            )}

            {payWithBitcoinEnabled && preferred_currency_code !== 'btc' && (
                <Button
                    borderRadius={'full'}
                    height={{ base: '42px', md: '58px' }}
                    opacity={1}
                    color={'white'}
                    _hover={{ opacity: 0.5 }}
                    backgroundColor={'#242424'}
                    isLoading={submitting}
                    isDisabled={disableButton}
                    onClick={() => handleDirectBitcoinPayment()}
                >
                    <Flex alignItems="center" gap={2}>
                        <Icon as={FaBitcoin} boxSize={7} color="#F7931A" />
                        Pay with Bitcoin
                    </Flex>
                </Button>
            )}

            <AddressModal
                customer={null}
                countryCode={process.env.NEXT_PUBLIC_FORCE_COUNTRY || 'us'}
                toggleSameAsBilling={toggleSameAsBilling}
                cart={cart}
                isOpen={isAddressModalOpen}
                onClose={onAddressModalClose}
                addressType={addressType}
            />
        </>
    );
};

export default PaymentButton;
