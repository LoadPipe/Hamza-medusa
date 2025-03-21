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
import { FaShieldAlt, FaBox, FaCopy } from 'react-icons/fa';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useState } from 'react';
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
    progress?: number;
}

const PaymentStatus = ({
    paymentId,
    status,
    createdAt,
    totalAmount,
    totalOrders,
    paymentAddress,
    orders,
    progress = 100,
}: PaymentStatusProps) => {
    const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});

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

        if (stepIndex < statusIndex) return 'green.400';
        if (stepIndex === statusIndex) return 'green.400';
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

    return (
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
                        borderColor="green.400"
                    >
                        <Text color="white" fontWeight="bold">
                            In Escrow
                        </Text>
                    </Box>
                </HStack>

                <Text color="gray.300">Payment #{paymentId}</Text>

                {/* Status Steps */}
                <HStack spacing={4} justify="space-between" align="flex-start">
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

                {/* Escrow Info */}
                <Box bg="gray.800" p={4} borderRadius="lg">
                    <HStack spacing={3}>
                        <Icon as={FaShieldAlt} color="green.400" />
                        <Text fontWeight="semibold" color="white">
                            Funds in Escrow
                        </Text>
                    </HStack>
                    <Text fontSize="sm" color="white" mt={2}>
                        Your funds are secured in escrow. They will be released
                        to the seller once you confirm receipt of your order.
                    </Text>

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

                    <VStack align="start" spacing={1} mt={4}>
                        <Text color="gray.500" fontSize="sm">
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
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<FaCopy />}
                            >
                                Copy
                            </Button>
                        </HStack>
                    </VStack>
                </Box>

                {/* Orders Section */}
                <Box>
                    <Text fontSize="xl" fontWeight="bold" mb={4} color="white">
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
                                    <Text color="white">Ξ {order.amount}</Text>
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
                                            <Text fontSize="sm" color="white">
                                                {order.details.specs}
                                            </Text>
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>
                        ))}
                    </VStack>

                    <HStack justify="space-between" mt={4}>
                        <Text color="white">Total Orders: {totalOrders}</Text>
                        <Text color="white">Total Amount: Ξ {totalAmount}</Text>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default PaymentStatus;
