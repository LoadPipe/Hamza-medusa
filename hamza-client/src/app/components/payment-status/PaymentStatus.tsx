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
} from '@chakra-ui/react';
import { FaBox, FaCopy } from 'react-icons/fa';
import { LuShieldCheck } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import StatusStep from './StatusStep';

interface PaymentStatusProps {
    paymentId: string;
    status: 'initiated' | 'pending' | 'received' | 'in_escrow' | 'complete';
    createdAt: string;
    totalAmount: number;
    totalOrders: number;
    paymentAddress: string;
    orders: Array<{
        id: string;
        storeName: string;
        amount: number;
        details?: {
            name: string;
            specs: string;
        };
    }>;
    start_time: number;
    end_time: number;
}

const PaymentStatus = ({
    paymentId,
    status,
    createdAt,
    totalAmount,
    totalOrders,
    paymentAddress,
    orders,
    start_time,
    end_time,
}: PaymentStatusProps) => {
    const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});
    const [progress, setProgress] = useState(0);

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
            (step) => step.status === status
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

    const getProgressStyle = (stepStatus: string, index: number) => {
        if (status === 'initiated' && stepStatus === 'initiated') {
            return {
                background: `linear-gradient(to right, 
                    ${getStatusColor(stepStatus)} ${progress}%, 
                    #2D3748 ${progress}%)`,
            };
        }
        return {
            background: getStatusColor(stepStatus),
        };
    };

    useEffect(() => {
        if (status !== 'initiated') {
            setProgress(100);
            return;
        }

        const timer = setInterval(() => {
            const currentProgress =
                ((Date.now() - start_time) / (end_time - start_time)) * 100;
            setProgress(Math.min(Math.max(currentProgress, 0), 100));
        }, 1000); // Update every second

        // Initial calculation immediately
        const initialProgress =
            ((Date.now() - start_time) / (end_time - start_time)) * 100;
        setProgress(Math.min(Math.max(initialProgress, 0), 100));

        return () => clearInterval(timer); // Cleanup on unmount
    }, [status]); // Added status to dependencies since we use it

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
                                In Escrow
                            </Text>
                        </Box>
                    </HStack>

                    <Text color="gray.300">Payment #{paymentId}</Text>

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
                                currentStatus={status}
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
                                <Text color="white">{createdAt}</Text>
                            </VStack>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.500" fontSize="sm">
                                    Total Amount:
                                </Text>
                                <Text color="white">Ξ {totalAmount}</Text>
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
                                        {paymentAddress}
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
                            {orders.map((order) => (
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
                                            <Icon as={FaBox} />
                                            <Text color="white">
                                                {order.id} - {order.storeName}
                                            </Text>
                                        </HStack>
                                        <Text color="white">
                                            Ξ {order.amount}
                                        </Text>
                                    </HStack>

                                    <Collapse in={openOrders[order.id]}>
                                        {order.details && (
                                            <Box mt={4} pl={8}>
                                                <Text
                                                    fontWeight="semibold"
                                                    color="white"
                                                >
                                                    {order.details.name}
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color="white"
                                                >
                                                    {order.details.specs}
                                                </Text>
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
                            <Text color="white">
                                Total Amount: Ξ {totalAmount}
                            </Text>
                        </HStack>
                    </Box>
                </VStack>
            </Box>
        </>
    );
};

export default PaymentStatus;
