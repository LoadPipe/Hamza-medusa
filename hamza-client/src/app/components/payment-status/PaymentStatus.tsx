'use client';

import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Button,
    Collapse,
    Spinner,
    Flex,
} from '@chakra-ui/react';
import { FaBox, FaCopy } from 'react-icons/fa';
import { LuShieldCheck } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import StatusStep from './StatusStep';

import { PaymentsDataProps } from '@/app/[countryCode]/(main)/order/processing/[id]/page';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@/lib/util/get-product-price';

const PaymentStatus = ({
    paymentsData,
    cartId,
}: {
    paymentsData: PaymentsDataProps[];
    cartId: string;
}) => {
    const paymentData = paymentsData[0];

    const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});
    const [progress, setProgress] = useState(0);
    const totalOrders = paymentData.orders.length;
    const currencyCode = paymentData.orders[0].currency_code;

    const statusSteps = [
        {
            label: 'Initiated',
            subLabel: 'Payment request created',
            status: 'initiated',
        },
        {
            label: 'Pending',
            subLabel: 'Waiting for payment',
            status: 'pending',
        },
        {
            label: 'Received',
            subLabel: 'Full payment received',
            status: 'received',
        },
        {
            label: 'In Escrow',
            subLabel: 'Funds secured in escrow',
            status: 'in_escrow',
        },
        {
            label: 'Complete',
            subLabel: 'Transaction Finalized',
            status: 'complete',
        },
    ];

    const getStatusColor = (stepStatus: string) => {
        const statusIndex = statusSteps.findIndex(
            (step) => step.status === paymentData.status
        );
        const stepIndex = statusSteps.findIndex(
            (step) => step.status === stepStatus
        );

        if (stepIndex < statusIndex) return 'primary.green.900';
        if (stepIndex === statusIndex) return 'primary.green.900';
        return 'gray.600';
    };

    const toggleOrder = (orderId: string) => {
        setOpenOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const calculateProgress = () => {
        const usedTime = Date.now() - paymentData.startTimestamp;
        const totalTime = paymentData.endTimestamp - paymentData.startTimestamp;
        return Math.min(Math.max((usedTime / totalTime) * 100, 0), 100);
    };

    useEffect(() => {
        if (paymentData.status !== 'initiated') {
            setProgress(100);
            return;
        }

        const timer = setInterval(() => {
            const currentProgress = calculateProgress();
            setProgress(currentProgress);
            console.log(currentProgress);
        }, 1000); // Update every second

        // Initial calculation immediately
        setProgress(calculateProgress());

        return () => clearInterval(timer); // Cleanup on unmount
    }, [paymentData.status]); // Added status to dependencies since we use it

    return (
        <>
            <Box bg="gray.900" p={6} borderRadius="xl">
                <VStack spacing={6} align="stretch">
                    {/* Payment Header */}
                    <HStack justify="space-between">
                        <Text fontSize="2xl" color="white" fontWeight="bold">
                            Payment Status
                        </Text>
                        <Box
                            bg="green.900"
                            px={3}
                            py={1}
                            borderRadius="3xl"
                            border="2px"
                            borderStyle="solid"
                            borderColor="primary.green.900"
                        >
                            <Text color="white" fontWeight="bold">
                                {
                                    statusSteps.find(
                                        (step) =>
                                            step.status === paymentData.status
                                    )?.label
                                }
                            </Text>
                        </Box>
                    </HStack>

                    <Text color="gray.300">Payment #{cartId}</Text>

                    {/* Status Steps */}
                    <HStack
                        spacing={4}
                        justify="space-between"
                        align="flex-start"
                    >
                        {statusSteps.map((step, index) => (
                            <StatusStep
                                key={step.status}
                                step={step}
                                currentStatus={paymentData.status}
                                index={index}
                                progress={progress}
                                getStatusColor={getStatusColor}
                            />
                        ))}
                    </HStack>

                    <Box height="1px" bg="gray.600" my={4} w="100%" />

                    {/* Escrow Info */}
                    <VStack spacing={0} align="start">
                        <HStack align="start">
                            <Icon
                                as={LuShieldCheck}
                                color="white"
                                w={6}
                                h={6}
                            />
                            <VStack spacing={0} align="start">
                                <Text fontWeight="semibold" color="white">
                                    Funds in Escrow
                                </Text>
                                <Text color="white" fontSize="sm">
                                    Funds are held in escrow until the
                                    transaction is finalized.
                                </Text>
                            </VStack>
                        </HStack>

                        <HStack mt={4} spacing={8}>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.500" fontSize="sm">
                                    Created
                                </Text>
                                <Text color="white">
                                    {new Date(paymentData.orders[0].created_at)
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
                                            paymentData.totalAmount,
                                            currencyCode
                                        )}
                                    </Text>
                                </Flex>
                            </VStack>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.500" fontSize="sm">
                                    Total Orders:
                                </Text>
                                <Text color="white">{totalOrders} items</Text>
                            </VStack>
                        </HStack>
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
                                    >
                                        {paymentData.paymentAddress}
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
                                <Box
                                    key={order.id}
                                    bg="gray.800"
                                    p={4}
                                    borderRadius="lg"
                                    cursor="pointer"
                                    onClick={() => toggleOrder(order.id)}
                                >
                                    <HStack justify="space-between">
                                        <HStack spacing={3}>
                                            <Icon as={FaBox} color="white" />
                                            <Text color="white">
                                                {order.id} - {order.store.name}
                                            </Text>
                                        </HStack>
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
                                                    order.payments[0].amount,
                                                    order.currency_code
                                                )}
                                            </Text>
                                        </Flex>
                                    </HStack>

                                    <Collapse in={openOrders[order.id]}>
                                        {order.detail && (
                                            <Box mt={4} pl={8}>
                                                {order.detail.items.map(
                                                    (item) => (
                                                        <HStack
                                                            key={item.id}
                                                            mb={2}
                                                        >
                                                            <Box>
                                                                <HStack>
                                                                    <Image
                                                                        src={
                                                                            item.thumbnail
                                                                        }
                                                                        alt={
                                                                            item.title
                                                                        }
                                                                        width={
                                                                            50
                                                                        }
                                                                        height={
                                                                            50
                                                                        }
                                                                    />
                                                                    <VStack>
                                                                        <Text color="white">
                                                                            {
                                                                                item.title
                                                                            }
                                                                        </Text>
                                                                        <Text
                                                                            color="gray.500"
                                                                            fontSize="sm"
                                                                        >
                                                                            {
                                                                                item
                                                                                    .variant
                                                                                    .title
                                                                            }
                                                                        </Text>
                                                                    </VStack>
                                                                </HStack>
                                                            </Box>
                                                            <Box>
                                                                <VStack>
                                                                    <Text color="gray.500">
                                                                        Sold by:
                                                                    </Text>
                                                                    <HStack>
                                                                        <Image
                                                                            src={
                                                                                order
                                                                                    .store
                                                                                    .icon
                                                                            }
                                                                            alt={
                                                                                order
                                                                                    .store
                                                                                    .name
                                                                            }
                                                                            width={
                                                                                20
                                                                            }
                                                                            height={
                                                                                20
                                                                            }
                                                                        />
                                                                        <Text color="white">
                                                                            {
                                                                                order
                                                                                    .store
                                                                                    .name
                                                                            }
                                                                        </Text>
                                                                    </HStack>
                                                                </VStack>
                                                            </Box>
                                                            <Box>
                                                                <VStack>
                                                                    <Text color="gray.500">
                                                                        Amount:
                                                                    </Text>
                                                                    <Flex>
                                                                        <Image
                                                                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                                                            src={
                                                                                currencyIcons[
                                                                                    item.currency_code ??
                                                                                        'usdc'
                                                                                ]
                                                                            }
                                                                            alt={
                                                                                item.currency_code ??
                                                                                'usdc'
                                                                            }
                                                                        />
                                                                        <Text
                                                                            ml="0.4rem"
                                                                            color="white"
                                                                        >
                                                                            {formatCryptoPrice(
                                                                                item.total,
                                                                                item.currency_code
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </VStack>
                                                            </Box>
                                                        </HStack>
                                                    )
                                                )}
                                            </Box>
                                        )}
                                    </Collapse>
                                </Box>
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
                                    src={currencyIcons[currencyCode ?? 'usdc']}
                                    alt={currencyCode ?? 'usdc'}
                                />
                                <Text ml="0.4rem" color="white">
                                    {formatCryptoPrice(
                                        paymentData.totalAmount,
                                        currencyCode
                                    )}
                                </Text>
                            </Flex>
                        </HStack>
                    </Box>
                </VStack>
            </Box>
        </>
    );
};

export default PaymentStatus;
