'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RadioGroup } from '@headlessui/react';
import ErrorMessage from '@modules/checkout/components/error-message';
import { Cart } from '@medusajs/medusa';
import { CheckCircleSolid, CreditCard } from '@medusajs/icons';
import { Container, Heading, Text, Tooltip, clx } from '@medusajs/ui';
import { Button } from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { SwitchNetwork } from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import Divider from '@modules/common/components/divider';
import Spinner from '@modules/common/icons/spinner';
import PaymentContainer from '@modules/checkout/components/payment-container';
import { setPaymentMethod } from '@modules/checkout/actions';
import { paymentInfoMap } from '@lib/constants';
import { EnsureWalletConnected } from '@/components/providers/ensure-wallet-connected';
const Payment = ({
    cart,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardBrand, setCardBrand] = useState<string | null>(null);
    const [cardComplete, setCardComplete] = useState(false);
    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    // useEffect hook to check if connection status changes
    // if !isConnected, connect to wallet
    useEffect(() => {
        if (!isConnected) {
            if (openConnectModal) openConnectModal();
        }
    }, [openConnectModal, isConnected]);

    //connects wallet if necessary
    const connectWallet = () => {
        connect();
    };

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get('step') === 'payment';

    const paymentReady =
        cart?.payment_session && cart?.shipping_methods.length !== 0;

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const set = async (providerId: string) => {
        setIsLoading(true);
        await setPaymentMethod(providerId)
            .catch((err) => setError(err.toString()))
            .finally(() => {
                if (providerId === 'paypal') return;
                setIsLoading(false);
            });
    };

    const handleChange = (providerId: string) => {
        setError(null);
        console.log('setting provider id', providerId);
        set(providerId);
    };

    const handleEdit = () => {
        router.push(pathname + '?' + createQueryString('step', 'payment'), {
            scroll: false,
        });
    };

    const handleSubmit = () => {
        if (!isConnected && openConnectModal) {
            openConnectModal();
        } else {
            setIsLoading(true);
            router.push(pathname + '?' + createQueryString('step', 'review'), {
                scroll: false,
            });
        }
    };

    useEffect(() => {
        setIsLoading(false);
        setError(null);
    }, [isOpen]);

    return (
        <div className="bg-black">
            <EnsureWalletConnected />
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    level="h2"
                    className={clx(
                        'flex flex-row text-3xl-regular gap-x-2 items-baseline text-white',
                        {
                            'opacity-50 pointer-events-none select-none':
                                !isOpen && !paymentReady,
                        }
                    )}
                >
                    Payment
                    {!isOpen && paymentReady && <CheckCircleSolid />}
                </Heading>
                {!isOpen && paymentReady && (
                    <Text>
                        <button
                            onClick={handleEdit}
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-white"
                        >
                            Edit
                        </button>
                    </Text>
                )}
            </div>
            <div>
                {cart?.payment_sessions?.length ? (
                    <div className={isOpen ? 'block' : 'hidden'}>
                        <RadioGroup
                            className="text-white"
                            value={cart.payment_session?.provider_id || ''}
                            onChange={(value: string) => handleChange(value)}
                        >
                            {cart.payment_sessions
                                .sort((a, b) => {
                                    return a.provider_id > b.provider_id
                                        ? 1
                                        : -1;
                                })
                                .map((paymentSession) => {
                                    return (
                                        <PaymentContainer
                                            paymentInfoMap={paymentInfoMap}
                                            paymentSession={paymentSession}
                                            key={paymentSession.id}
                                            selectedPaymentOptionId={
                                                cart.payment_session
                                                    ?.provider_id || null
                                            }
                                        />
                                    );
                                })}
                        </RadioGroup>

                        <ErrorMessage error={error} />

                        <Button
                            height="52px"
                            color={'white'}
                            backgroundColor="primary.indigo.900"
                            className="mt-6  py-3 px-6 rounded text-base"
                            _hover={{
                                backgroundColor: 'white',
                                color: 'black',
                            }}
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            disabled={!cart.payment_session}
                        >
                            Continue to review
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-16 text-ui-fg-base">
                        <Spinner />
                    </div>
                )}

                <div className={isOpen ? 'hidden' : 'block'}>
                    {cart && paymentReady && cart.payment_session && (
                        <div className="flex items-start gap-x-1 w-full">
                            <div className="flex flex-col w-1/3 text-white">
                                <Text className="txt-medium-plus text-white mb-1">
                                    Payment method
                                </Text>
                                <Text className="txt-medium text-white">
                                    {paymentInfoMap[
                                        cart.payment_session.provider_id
                                    ]?.title ||
                                        cart.payment_session.provider_id}
                                </Text>
                                {process.env.NODE_ENV === 'development' &&
                                    !Object.hasOwn(
                                        paymentInfoMap,
                                        cart.payment_session.provider_id
                                    ) && (
                                        <Tooltip content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.ts'" />
                                    )}
                            </div>
                            <div className="flex flex-col w-1/3">
                                <Text className="txt-medium-plus text-white mb-1">
                                    Payment details
                                </Text>
                                <div className="flex gap-2 txt-medium text-white items-center">
                                    {/* <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover"> */}
                                    {/* //todo add custom icon afterwards */}
                                    {/* </Container> */}
                                    <Text className="text-white">
                                        {cart.payment_session.provider_id ===
                                        cardBrand
                                            ? cardBrand
                                            : 'Another step will appear'}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Divider className="mt-8" />
        </div>
    );
};

export default Payment;
