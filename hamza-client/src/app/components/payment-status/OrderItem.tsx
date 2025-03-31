'use client';

import {
    Box,
    HStack,
    Icon,
    Text,
    Collapse,
    Flex,
    VStack,
} from '@chakra-ui/react';
import { FaBox } from 'react-icons/fa';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { LineItem } from '@/app/[countryCode]/(main)/order/processing/[id]/page';
import OrderItemDetails from './OrderItemDetails';
import { isServer } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Payment } from '@medusajs/medusa';

interface OrderItemProps {
    order: any; // Replace with proper type
    isOpen: boolean;
    onToggle: () => void;
    currencyCode: string;
}

const OrderItem = ({
    order,
    isOpen,
    onToggle,
    currencyCode,
}: OrderItemProps) => {
    // calculate totals
    // const [orderTotal, setOrderTotal] = useState(0);
    // const [paymentTotal, setPaymentTotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
        const orderTotal = order.detail.items.reduce(
            (acc: number, item: LineItem) => acc + item.total,
            0
        );

        const paymentTotal = order.detail.payments.reduce(
            (acc: number, payment: Payment) => acc + payment.amount,
            0
        );

        const shippingCost = paymentTotal - orderTotal;
        setShippingCost(shippingCost);
    }, [order]);

    return (
        <Box
            bg="gray.800"
            p={4}
            borderRadius="lg"
            cursor="pointer"
            onClick={onToggle}
        >
            <HStack justify="space-between">
                <HStack spacing={3}>
                    <Icon as={FaBox} color="white" />
                    <Text color="white" display={{ base: 'none', md: 'block' }}>
                        {`${order.id} - ${order.store.name}`}
                    </Text>
                    <Text color="white" display={{ base: 'block', md: 'none' }}>
                        {`...${order.id.slice(-10)}`}
                        <br />
                        {order.store.name}
                    </Text>
                </HStack>
                <Flex alignItems="center" gap={2}>
                    <Flex>
                        <Image
                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                            src={currencyIcons[currencyCode ?? 'usdc']}
                            alt={currencyCode ?? 'usdc'}
                        />
                        <Text ml="0.4rem" color="white">
                            {formatCryptoPrice(
                                order.payments[0].amount,
                                order.currency_code
                            )}
                        </Text>
                    </Flex>
                    <Icon
                        as={isOpen ? ChevronUpIcon : ChevronDownIcon}
                        color="white"
                        boxSize={5}
                    />
                </Flex>
            </HStack>

            <Collapse in={isOpen}>
                {order.detail && (
                    <>
                        <Box mt={4}>
                            {order.detail.items.map((item: LineItem) => (
                                <OrderItemDetails
                                    key={item.id}
                                    item={item}
                                    storeName={order.store.name}
                                    storeIcon={order.store.icon}
                                    isLastItem={
                                        item.id ===
                                        order.detail.items[
                                            order.detail.items.length - 1
                                        ].id
                                    }
                                />
                            ))}
                        </Box>
                        <Box
                            borderTop="1px"
                            borderColor="gray.700"
                            mt={4}
                            pt={4}
                        >
                            <HStack justifyContent="flex-end" gap={3}>
                                <Text color="gray.500">Shipping Cost:</Text>
                                <Flex>
                                    <Image
                                        className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                        src={
                                            currencyIcons[
                                                order.currency_code ?? 'usdc'
                                            ]
                                        }
                                        alt={order.currency_code ?? 'usdc'}
                                    />
                                    <Text ml="0.4rem" color="white">
                                        {formatCryptoPrice(
                                            shippingCost ?? 0,
                                            order.currency_code
                                        )}
                                    </Text>
                                </Flex>
                            </HStack>
                        </Box>
                    </>
                )}
            </Collapse>
        </Box>
    );
};

export default OrderItem;
