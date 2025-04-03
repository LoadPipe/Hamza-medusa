'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { BsBox } from 'react-icons/bs';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { EscrowStatusString } from '@/lib/server/enums';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { divide } from 'lodash';

// Define types for the component
interface LineItem {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string | null;
    variant?: {
        title: string;
    };
}

interface ExtendedOrder {
    id: string;
    display_id: number;
    store?: {
        name: string;
    };
    items: LineItem[];
    shipping_methods: {
        price: number;
    }[];
    currency_code: string;
    escrow_status: string;
    subtotal?: number;
    shipping_total?: number;
    tax_total?: number;
    discount_total?: number;
    total?: number;
    payments?: Array<{
        amount: number;
    }>;
    discounts?: Array<{
        code: string;
    }>;
}

interface OrderConfirmedProps {
    params: {
        id: string;
    };
    orders: ExtendedOrder[];
}

const OrderConfirmed: React.FC<OrderConfirmedProps> = ({ params, orders }) => {
    // calculate total
    const cartOrderTotal = orders.reduce(
        (total: number, order: ExtendedOrder) =>
            total +
            order.items.reduce(
                (itemTotal: number, item: LineItem) =>
                    itemTotal + item.unit_price * item.quantity,
                0
            ),
        0
    );

    const cartShippingTotal = orders.reduce(
        (total: number, order: ExtendedOrder) =>
            total +
            order.shipping_methods.reduce(
                (shippingTotal: number, method: any) =>
                    shippingTotal + (method.price ?? 0),
                0
            ),
        0
    );

    const totalPaid = cartOrderTotal + cartShippingTotal;

    const currencyCode = orders[0].currency_code;

    return (
        <Flex
            direction="column"
            maxW="800px"
            mx="auto"
            bg="#121212"
            borderRadius="16px"
            p={{ base: '1.5rem', md: '2rem' }}
            color="white"
            gap={8}
        >
            {/* Success Header */}
            <Flex direction="column" align="center" gap={4}>
                <Icon as={MdCheckCircle} color="#94D42A" boxSize="48px" />
                <Text fontSize="24px" fontWeight="600">
                    Payment Successful!
                </Text>
                <Text fontSize="16px" color="gray.300" textAlign="center">
                    Thank you for your order!
                </Text>
                <Text fontSize="16px" color="gray.300" textAlign="center">
                    Order confirmation has been sent to your registered email.
                </Text>
            </Flex>

            {/* Payment ID */}
            <Flex justify="space-between" align="center">
                <Text fontSize="18px" fontWeight="500">
                    Payment #{params.id}
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
                        Completed
                    </Text>
                </Box>
            </Flex>

            {/* Order Summary */}
            <Box>
                <Text fontSize="20px" fontWeight="600" mb={4}>
                    Order Summary
                </Text>

                {orders.map((order: ExtendedOrder, orderIndex: number) => {
                    const orderTotal = order.items.reduce(
                        (total: number, item: LineItem) =>
                            total + item.unit_price * item.quantity,
                        0
                    );

                    const orderPaymentTotal = (order.payments || []).reduce(
                        (total: number, payment: any) =>
                            total + (payment.amount ?? 0),
                        0
                    );

                    // #TODO: need to consider discount total as well.
                    const orderShippingTotal = orderPaymentTotal - orderTotal;

                    return (
                        <Box
                            key={order.id}
                            borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                            pb={4}
                        >
                            <Flex
                                key={order.id}
                                direction="column"
                                gap={4}
                                mt={orderIndex > 0 ? 8 : 0}
                                pb={orderIndex === orders.length - 1 ? 4 : 0}
                            >
                                <Flex
                                    align="center"
                                    gap={2}
                                    justify="space-between"
                                >
                                    <Text>
                                        <Icon as={BsBox} mr={2} />
                                        {order.id} - {order.store?.name}
                                    </Text>

                                    <Button
                                        size="sm"
                                        bg="gray.700"
                                        color="white"
                                        borderRadius="2rem"
                                        _hover={{ bg: 'gray.600' }}
                                        p={3}
                                    >
                                        Release Escrow
                                    </Button>
                                </Flex>

                                {order.items.map(
                                    (item: LineItem, itemIndex: number) => (
                                        <Flex
                                            key={item.id}
                                            direction="column"
                                            gap={4}
                                        >
                                            <Flex gap={4} py={4}>
                                                <Box
                                                    w="48px"
                                                    h="48px"
                                                    bg="gray.800"
                                                    borderRadius="8px"
                                                    overflow="hidden"
                                                >
                                                    {item.thumbnail && (
                                                        <Image
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            width={48}
                                                            height={48}
                                                            style={{
                                                                objectFit:
                                                                    'cover',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Flex
                                                    flex={1}
                                                    direction="column"
                                                    gap={1}
                                                >
                                                    <Text fontWeight="500">
                                                        {item.title}
                                                    </Text>
                                                    <Text
                                                        color="gray.400"
                                                        fontSize="14px"
                                                    >
                                                        Quantity:{' '}
                                                        {item.quantity}
                                                        {item.variant &&
                                                            ` | Variation: ${item.variant.title}`}
                                                    </Text>
                                                </Flex>
                                                <HStack
                                                    fontWeight="500"
                                                    alignItems={'flex-start'}
                                                >
                                                    <Image
                                                        className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] mt-[2px]"
                                                        src={
                                                            currencyIcons[
                                                                order.currency_code ??
                                                                    'usdc'
                                                            ]
                                                        }
                                                        alt={
                                                            order.currency_code ??
                                                            'usdc'
                                                        }
                                                    />
                                                    <Text>
                                                        {formatCryptoPrice(
                                                            item.unit_price *
                                                                item.quantity,
                                                            order.currency_code
                                                        )}{' '}
                                                        {order.currency_code.toUpperCase()}
                                                    </Text>
                                                </HStack>
                                            </Flex>
                                        </Flex>
                                    )
                                )}
                            </Flex>
                            <HStack
                                justifyContent="space-between"
                                gap={3}
                                mt={4}
                                // borderTop="1px solid rgba(255, 255, 255, 0.1)"
                                // pt={4}
                            >
                                <HStack justify="space-between" align="center">
                                    <Text color="white">
                                        Status:{' '}
                                        {order.escrow_status
                                            ? EscrowStatusString[
                                                  order.escrow_status as keyof typeof EscrowStatusString
                                              ]
                                            : ''}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Text color="gray.500">Shipping Cost:</Text>
                                    <Flex>
                                        <Image
                                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                            src={
                                                currencyIcons[
                                                    order.currency_code ??
                                                        'usdc'
                                                ]
                                            }
                                            alt={order.currency_code ?? 'usdc'}
                                        />
                                        <Text ml="0.4rem" color="white">
                                            {formatCryptoPrice(
                                                orderShippingTotal,
                                                order.currency_code
                                            )}
                                        </Text>
                                    </Flex>
                                </HStack>
                            </HStack>
                        </Box>
                    );
                })}
            </Box>

            {/* Payment Summary */}
            <Box>
                <Text fontSize="18px" fontWeight="600" mb={4}>
                    Payment Summary
                </Text>
                <Flex direction="column" gap={3}>
                    <Flex justify="space-between" color="gray.300">
                        <Text>Total Order Cost:</Text>
                        <Text>
                            {formatCryptoPrice(cartOrderTotal, currencyCode)}{' '}
                            {currencyCode.toUpperCase()}
                        </Text>
                    </Flex>
                    <Flex justify="space-between" color="gray.300">
                        <Text>Total Shipping Cost:</Text>
                        <Text>
                            {formatCryptoPrice(cartShippingTotal, currencyCode)}{' '}
                            {currencyCode.toUpperCase()}
                        </Text>
                    </Flex>
                    <Flex justify="space-between" color="gray.300">
                        <Text>Taxes:</Text>
                        <Text>
                            {formatCryptoPrice(
                                orders.reduce(
                                    (total: number, order: ExtendedOrder) =>
                                        total + (order.tax_total || 0),
                                    0
                                ),
                                currencyCode
                            )}{' '}
                            {currencyCode.toUpperCase()}
                        </Text>
                    </Flex>
                    {orders.some(
                        (order) => order.discounts && order.discounts.length > 0
                    ) && (
                        <>
                            <Flex justify="space-between" color="gray.300">
                                <Text>Applied Discount Code:</Text>
                                <Text>
                                    {orders
                                        .map((order) =>
                                            order.discounts?.map(
                                                (discount) => discount.code
                                            )
                                        )
                                        .flat()
                                        .join(', ')}
                                </Text>
                            </Flex>
                            <Flex justify="space-between" color="gray.300">
                                <Text>Discount:</Text>
                                <Text>
                                    -{' '}
                                    {formatCryptoPrice(
                                        orders.reduce(
                                            (
                                                total: number,
                                                order: ExtendedOrder
                                            ) =>
                                                total +
                                                (order.discount_total || 0),
                                            0
                                        ),
                                        currencyCode
                                    )}{' '}
                                    {currencyCode.toUpperCase()}
                                </Text>
                            </Flex>
                        </>
                    )}
                    <Flex
                        justify="space-between"
                        color="white"
                        fontWeight="600"
                        mt={2}
                    >
                        <Text>Total Amount Paid:</Text>
                        <Text>
                            {formatCryptoPrice(totalPaid, currencyCode)}{' '}
                            {currencyCode.toUpperCase()}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            {/* Check Status Button */}
            <Link href="/account/orders" style={{ width: '100%' }}>
                <Button
                    width="100%"
                    height="56px"
                    backgroundColor="#94D42A"
                    color="black"
                    fontSize="16px"
                    fontWeight="600"
                    _hover={{ backgroundColor: '#86C01E' }}
                >
                    Check Status
                </Button>
            </Link>
        </Flex>
    );
};

export default OrderConfirmed;
