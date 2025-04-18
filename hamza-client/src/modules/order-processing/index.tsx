'use client';

import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Flex,
    Stack,
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StatusStep from './components/StatusStep';
import OrderItem from './components/OrderItem';

import { PaymentsDataProps } from '@/app/[countryCode]/(main)/order/processing/[id]/page';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { STATUS_STEPS } from './types';
import { getPaymentData } from '@/lib/server';
import { useAccount } from 'wagmi';
import { ModalCoverWalletConnect } from '../common/components/modal-cover-wallet-connect';
import { calculateStepState } from './utils';

const PaymentStatus = ({
    startTimestamp,
    endTimestamp,
    paymentsData,
    cartId,
}: {
    cartId: string;
    startTimestamp: number;
    endTimestamp: number;
    paymentsData: PaymentsDataProps[];
}) => {
    const router = useRouter();
    const initialPaymentData = paymentsData[0];
    const [paymentData, setPaymentData] = useState(initialPaymentData);
    const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});
    const [progress, setProgress] = useState(0);
    const { isConnected } = useAccount();
    const [isClient, setIsClient] = useState<boolean>(false);
    const totalOrders = paymentData.orders.length;
    const totalItems = paymentData.orders.reduce((total, order) => {
        const orderTotalItems = order.items.reduce(
            (totalItems, item) => totalItems + item.quantity,
            0
        );
        return total + orderTotalItems;
    }, 0);
    const paymentTotal = initialPaymentData.orders.reduce((total, order) => {
        const orderTotal = order.detail.payments.reduce(
            (paymentTotal, payment) => paymentTotal + payment.amount,
            0
        );
        return total + orderTotal;
    }, 0);
    const currencyCode = initialPaymentData.orders[0].currency_code;

    const toggleOrder = (orderId: string) => {
        setOpenOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const calculateProgress = useCallback(() => {
        const usedTime = Date.now() - startTimestamp;
        const totalTime = endTimestamp - startTimestamp;
        return Math.min(Math.max((usedTime / totalTime) * 100, 0), 100);
    }, [startTimestamp, endTimestamp]);

    // handling progress bar timer
    useEffect(() => {
        setIsClient(true);

        if (paymentData.status !== 'waiting') {
            setProgress(100);
            return;
        }

        const timer = setInterval(() => {
            const currentProgress = calculateProgress();
            setProgress(currentProgress);

            // If progress reaches 100% (timer is done), change status to expired
            if (currentProgress >= 100) {
                setPaymentData((prev) => ({
                    ...prev,
                    status: 'expired',
                }));
                clearInterval(timer);
            }
        }, 1000);

        setProgress(calculateProgress());

        return () => clearInterval(timer);
    }, [paymentData.status, calculateProgress]);

    // handling polling of payments endpoint for status updates
    useEffect(() => {
        const timer = setInterval(
            async () => {
                try {
                    // console.log('Polling payment status...');
                    const payments = await getPaymentData(cartId);
                    if (payments && payments.length > 0) {
                        const payment = payments[0];

                        // Stop polling if payment is expired
                        if (payment.status === 'expired') {
                            clearInterval(timer);
                            return;
                        }

                        // Redirect if payment is in escrow
                        if (payment.status === 'in_escrow') {
                            router.push(
                                `/order/confirmed/${payment.orders[0].id}?cart=${cartId}`
                            );
                        }
                    }
                } catch (error) {
                    console.error('Error polling payment status:', error);
                }
            },
            Number(process.env.NEXT_PUBLIC_PAYMENT_POLLING_INTERVAL) || 5000
        );

        return () => clearInterval(timer);
    }, [cartId, router]);

    if (!isClient) {
        return (
            <ModalCoverWalletConnect
                title="Proceed to Escrow"
                message="To view order processing details, please connect your wallet"
                pageIsLoading={isClient}
            />
        ); // Render nothing on the server
    }

    return (
        <div>
            {!isConnected ? (
                <ModalCoverWalletConnect
                    title="Proceed to Escrow"
                    message="To view escrow details, please connect your wallet"
                    pageIsLoading={isClient}
                />
            ) : (
                <>
                    <Box bg="gray.900" p={6} borderRadius="xl">
                        <VStack spacing={6} align="stretch">
                            {/* Payment Header */}
                            <HStack justify="space-between">
                                <Text
                                    fontSize="2xl"
                                    color="white"
                                    fontWeight="bold"
                                >
                                    Payment Status
                                </Text>
                                <Box
                                    bg={
                                        paymentData.status === 'expired'
                                            ? 'red.900'
                                            : paymentData.status === 'partial'
                                              ? 'orange.900'
                                              : 'green.900'
                                    }
                                    px={3}
                                    py={1}
                                    borderRadius="3xl"
                                    border="2px"
                                    borderStyle="solid"
                                    borderColor={
                                        paymentData.status === 'expired'
                                            ? 'red.500'
                                            : paymentData.status === 'partial'
                                              ? 'orange.400'
                                              : 'primary.green.900'
                                    }
                                >
                                    <Text color="white" fontWeight="bold">
                                        {paymentData.status === 'expired'
                                            ? 'Expired'
                                            : paymentData.status === 'partial'
                                              ? 'Partial'
                                              : STATUS_STEPS.find(
                                                    (step) =>
                                                        step.status ===
                                                        paymentData.status
                                                )?.label}
                                    </Text>
                                </Box>
                            </HStack>

                            <Text color="gray.300">Payment #{cartId}</Text>

                            {/* Status Steps */}
                            <Box display={{ base: 'block', md: 'none' }}>
                                {STATUS_STEPS.map(
                                    (step, index) =>
                                        (step.status === paymentData.status ||
                                            (step.status === 'waiting' &&
                                                paymentData.status ===
                                                    'expired')) && (
                                            <StatusStep
                                                key={step.status}
                                                step={step}
                                                index={index}
                                                progress={progress}
                                                currentStatus={
                                                    paymentData.status
                                                }
                                                {...calculateStepState(
                                                    step.status,
                                                    paymentData.status,
                                                    progress,
                                                    endTimestamp,
                                                    startTimestamp
                                                )}
                                            />
                                        )
                                )}
                            </Box>
                            <HStack
                                spacing={4}
                                justify="space-between"
                                align="flex-start"
                                display={{ base: 'none', md: 'flex' }}
                            >
                                {STATUS_STEPS.map((step, index) => (
                                    <StatusStep
                                        key={step.status}
                                        step={step}
                                        index={index}
                                        progress={progress}
                                        currentStatus={paymentData.status}
                                        {...calculateStepState(
                                            step.status,
                                            paymentData.status,
                                            progress,
                                            endTimestamp,
                                            startTimestamp
                                        )}
                                    />
                                ))}
                            </HStack>

                            <Box height="1px" bg="gray.600" my={4} w="100%" />

                            {/* Escrow Info */}
                            <VStack spacing={0} align="start">
                                <Stack
                                    mt={4}
                                    spacing={8}
                                    direction={{ base: 'column', md: 'row' }}
                                    align={{
                                        base: 'stretch',
                                        md: 'flex-start',
                                    }}
                                >
                                    <VStack align="start" spacing={1}>
                                        <Text color="gray.500" fontSize="sm">
                                            Created:
                                        </Text>
                                        <Text color="white">
                                            {new Date(
                                                paymentData.orders[0].created_at
                                            )
                                                .toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })
                                                .replace(',', ' -')}
                                        </Text>
                                    </VStack>
                                    <VStack align="start" spacing={1}>
                                        <Text color="gray.500" fontSize="sm">
                                            Total Amount:
                                        </Text>
                                        <Flex>
                                            <Image
                                                className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                                src={
                                                    currencyIcons[
                                                        currencyCode ?? 'usdc'
                                                    ]
                                                }
                                                alt={currencyCode ?? 'usdc'}
                                            />
                                            <Text ml="0.4rem" color="white">
                                                {formatCryptoPrice(
                                                    paymentTotal,
                                                    currencyCode
                                                )}
                                            </Text>
                                        </Flex>
                                    </VStack>
                                    <VStack align="start" spacing={1}>
                                        <Text color="gray.500" fontSize="sm">
                                            Total Items:
                                        </Text>
                                        <Text color="white">
                                            {totalItems} items
                                        </Text>
                                    </VStack>
                                </Stack>
                            </VStack>

                            <Box bg="gray.800" p={4} borderRadius="lg">
                                <HStack justify="space-between">
                                    <VStack align="start" spacing={1}>
                                        <Text color="white" fontSize="sm">
                                            Payment address
                                        </Text>
                                        <HStack spacing={2}>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="monospace"
                                                color="white"
                                                display={{
                                                    base: 'none',
                                                    md: 'block',
                                                }}
                                            >
                                                {paymentData.paymentAddress}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontFamily="monospace"
                                                color="white"
                                                display={{
                                                    base: 'block',
                                                    md: 'none',
                                                }}
                                            >
                                                ...
                                                {paymentData.paymentAddress.slice(
                                                    -10
                                                )}
                                            </Text>
                                        </HStack>
                                    </VStack>

                                    <Button
                                        size="sm"
                                        bg="gray.700"
                                        color="white"
                                        borderRadius="2rem"
                                        leftIcon={<FaCopy color="white" />}
                                        _hover={{ bg: 'gray.600' }}
                                        p={6}
                                    >
                                        Copy
                                    </Button>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>

                    <Box bg="gray.900" mt={8} p={6} borderRadius="xl">
                        <VStack spacing={6} align="stretch">
                            {/* Orders Section */}
                            <Box>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    mb={4}
                                    color="white"
                                >
                                    Orders
                                </Text>
                                <VStack spacing={3} align="stretch">
                                    {paymentData.orders.map((order) => (
                                        <OrderItem
                                            key={order.id}
                                            order={order}
                                            isOpen={openOrders[order.id]}
                                            onToggle={() =>
                                                toggleOrder(order.id)
                                            }
                                            currencyCode={currencyCode}
                                        />
                                    ))}
                                </VStack>

                                <HStack justify="space-between" mt={4}>
                                    <Text color="white">
                                        Total Orders: {totalOrders}
                                    </Text>
                                    <Flex gap={2}>
                                        <Text color="white">Total Amount:</Text>
                                        <Image
                                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                            src={
                                                currencyIcons[
                                                    currencyCode ?? 'usdc'
                                                ]
                                            }
                                            alt={currencyCode ?? 'usdc'}
                                        />
                                        <Text ml="0.4rem" color="white">
                                            {formatCryptoPrice(
                                                paymentTotal,
                                                currencyCode
                                            )}
                                        </Text>
                                    </Flex>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                </>
            )}
        </div>
    );
};

export default PaymentStatus;
