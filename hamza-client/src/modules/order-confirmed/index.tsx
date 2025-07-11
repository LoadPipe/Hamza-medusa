'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { BsBox } from 'react-icons/bs';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { EscrowStatusString } from '@/lib/server/enums';
import currencyIcons from '@/images/currencies/crypto-currencies';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { FaBitcoin } from 'react-icons/fa';

// Define types for the component
interface LineItem {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string | null;
    variant?: {
        title: string;
        product?: {
            handle: string;
        };
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
        metadata?: {
            chainType?: string;
            chainId?: string;
            currency?: string;
            amount?: string;
        };
    }>;
    discounts?: Array<{
        code: string;
    }>;
    cart?: {
        discounts?: Array<{
            code: string;
        }>;
        id: string;
    };
}

interface OrderConfirmedProps {
    params: {
        id: string;
    };
    orders: ExtendedOrder[];
}

const OrderConfirmed: React.FC<OrderConfirmedProps> = ({ params, orders }) => {
    // calculate totals
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

    const cartSubTotal = cartOrderTotal + cartShippingTotal;

    const totalPaid = orders.reduce(
        (totalPaid: number, order: ExtendedOrder) =>
            totalPaid +
            (order.payments || []).reduce(
                (paymentTotal: number, payment: any) =>
                    paymentTotal + (payment.amount ?? 0),
                0
            ),
        0
    );

    const cartDiscountTotal = cartSubTotal - totalPaid;

    const cartDiscountCode = Array.from(
        new Set(
            orders
                .flatMap((order) => order.cart?.discounts || [])
                .map((discount) => discount.code)
        )
    ).join(', ');

    const currencyCode = orders[0].currency_code;

    const getBitcoinPaymentInfo = () => {
        let hasBitcoinPayment = false;
        let bitcoinAmount: string = '';

        orders.forEach((order) => {
            if (order.payments) {
                order.payments.forEach((payment) => {
                    if (payment.metadata?.currency === 'btc') {
                        hasBitcoinPayment = true;
                        bitcoinAmount = payment.metadata.amount ?? '';
                    }
                });
            }
        });

        return { hasBitcoinPayment, bitcoinAmount };
    };

    const orderContainsDigitalItems = (order: any) => {
        for (let item of order?.items) {
            if (item?.variant?.product?.metadata) {
                console.log(item?.variant?.product?.metadata);
                return true;
            }
        }
        return false;
    };

    const checkoutContainsDigitalItems = () => {
        for (let order of orders) {
            if (orderContainsDigitalItems(order)) return true;
        }
        return false;
    };

    const { hasBitcoinPayment, bitcoinAmount } = getBitcoinPaymentInfo();

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
                <Text
                    fontSize="18px"
                    fontWeight="500"
                    display={{ base: 'none', md: 'block' }}
                >
                    Cart ID: {orders[0].cart?.id}
                </Text>
                <Text
                    fontSize="18px"
                    fontWeight="500"
                    display={{ base: 'block', md: 'none' }}
                >
                    #...{orders[0].cart?.id.slice(-10)}
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
                    const orderShippingTotal = order.shipping_methods.reduce(
                        (total: number, method: any) =>
                            total + (method.price ?? 0),
                        0
                    );

                    const orderSubTotal = orderTotal + orderShippingTotal;

                    const orderDiscountTotal =
                        orderSubTotal - orderPaymentTotal;

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
                                    flexWrap={{
                                        base: 'wrap',
                                        md: 'nowrap',
                                    }}
                                >
                                    <Flex>
                                        <Icon
                                            as={BsBox}
                                            width={6}
                                            height={6}
                                            mr={2}
                                        />
                                        <Text marginRight={2}>
                                            #...
                                            {order.id
                                                .replace(/^order_/, '')
                                                .slice(-10)}
                                        </Text>
                                        {order.store?.name}
                                    </Flex>

                                    <Button
                                        as={Link}
                                        href={`/account/escrow/${order.id}`}
                                        size="sm"
                                        bg="gray.700"
                                        color="white"
                                        borderRadius="2rem"
                                        width={{
                                            base: '100%',
                                            md: 'auto',
                                        }}
                                        _hover={{ bg: 'gray.600' }}
                                        p={3}
                                    >
                                        View Escrow
                                    </Button>
                                </Flex>

                                {order.items.map(
                                    (item: LineItem, itemIndex: number) => {
                                        const productHandle =
                                            item.variant?.product?.handle;

                                        return (
                                            <Flex
                                                key={item.id}
                                                direction="column"
                                                gap={4}
                                            >
                                                <Flex gap={4} py={4}>
                                                    {productHandle ? (
                                                        <LocalizedClientLink
                                                            href={`/products/${productHandle}`}
                                                        >
                                                            <Box
                                                                w="48px"
                                                                h="48px"
                                                                bg="gray.800"
                                                                borderRadius="8px"
                                                                overflow="hidden"
                                                                cursor="pointer"
                                                                _hover={{
                                                                    opacity: 0.8,
                                                                }}
                                                                transition="opacity 0.2s"
                                                            >
                                                                {item.thumbnail && (
                                                                    <Image
                                                                        src={
                                                                            item.thumbnail
                                                                        }
                                                                        alt={
                                                                            item.title
                                                                        }
                                                                        width={
                                                                            48
                                                                        }
                                                                        height={
                                                                            48
                                                                        }
                                                                        style={{
                                                                            objectFit:
                                                                                'cover',
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </LocalizedClientLink>
                                                    ) : (
                                                        <Box
                                                            w="48px"
                                                            h="48px"
                                                            bg="gray.800"
                                                            borderRadius="8px"
                                                            overflow="hidden"
                                                        >
                                                            {item.thumbnail && (
                                                                <Image
                                                                    src={
                                                                        item.thumbnail
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    width={48}
                                                                    height={48}
                                                                    style={{
                                                                        objectFit:
                                                                            'cover',
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    )}

                                                    <Flex
                                                        flex={1}
                                                        direction="column"
                                                        gap={1}
                                                    >
                                                        {/* Clickable Title */}
                                                        {productHandle ? (
                                                            <LocalizedClientLink
                                                                href={`/products/${productHandle}`}
                                                            >
                                                                <Text
                                                                    fontWeight="500"
                                                                    cursor="pointer"
                                                                    _hover={{
                                                                        color: '#94D42A',
                                                                    }}
                                                                    transition="color 0.2s"
                                                                >
                                                                    {item.title}
                                                                </Text>
                                                            </LocalizedClientLink>
                                                        ) : (
                                                            <Text fontWeight="500">
                                                                {item.title}
                                                            </Text>
                                                        )}

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
                                                        alignItems={
                                                            'flex-start'
                                                        }
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
                                                            )}
                                                        </Text>
                                                    </HStack>
                                                </Flex>
                                            </Flex>
                                        );
                                    }
                                )}
                            </Flex>
                            <HStack
                                justifyContent="space-between"
                                gap={3}
                                mt={4}
                                flexWrap={{
                                    base: 'wrap',
                                    md: 'nowrap',
                                }}
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
                                <VStack align="flex-end">
                                    {orderShippingTotal > 0 && (
                                        <HStack>
                                            <Text color="gray.500">
                                                Shipping Cost:
                                            </Text>
                                            <Flex>
                                                <Image
                                                    className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
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
                                                <Text ml="0.4rem" color="white">
                                                    {formatCryptoPrice(
                                                        orderShippingTotal,
                                                        order.currency_code
                                                    )}
                                                </Text>
                                            </Flex>
                                        </HStack>
                                    )}
                                    {orderDiscountTotal > 0 && (
                                        <HStack>
                                            <Text color="gray.500">
                                                Discount:
                                            </Text>
                                            <Flex>
                                                <Image
                                                    className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
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
                                                <Text ml="0.4rem" color="white">
                                                    {formatCryptoPrice(
                                                        orderDiscountTotal,
                                                        order.currency_code
                                                    )}
                                                </Text>
                                            </Flex>
                                        </HStack>
                                    )}
                                </VStack>
                            </HStack>
                        </Box>
                    );
                })}
            </Box>

            {/* Special Note */}
            {checkoutContainsDigitalItems() && (
                <Box>
                    <Text fontSize="18px" fontWeight="600" mb={4}>
                        IMPORTANT:
                    </Text>
                    <Flex direction="column" gap={3}>
                        <Text color="gray.400" fontSize="14px">
                            If you ordered a digital product and did not receive
                            it, please contact us right away at{' '}
                            <b>
                                <u>support@hamza.market</u>
                            </b>
                            , or{' '}
                            <b>
                                click the green chat icon in the bottom right of
                                the page
                            </b>
                            .
                        </Text>
                    </Flex>
                </Box>
            )}

            {/* Payment Summary */}
            <Box>
                <Text fontSize="18px" fontWeight="600" mb={4}>
                    Payment Summary
                </Text>
                <Flex direction="column" gap={3}>
                    <Flex justify="space-between" color="gray.300">
                        <Text>Total Order Cost:</Text>
                        <HStack>
                            <Image
                                className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                src={currencyIcons[currencyCode ?? 'usdc']}
                                alt={currencyCode ?? 'usdc'}
                            />
                            <Text>
                                {formatCryptoPrice(
                                    cartOrderTotal,
                                    currencyCode
                                )}
                            </Text>
                        </HStack>
                    </Flex>
                    {cartShippingTotal > 0 && (
                        <Flex justify="space-between" color="gray.300">
                            <Text>Total Shipping Cost:</Text>
                            <HStack>
                                <Image
                                    className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                    src={currencyIcons[currencyCode ?? 'usdc']}
                                    alt={currencyCode ?? 'usdc'}
                                />
                                <Text>
                                    {formatCryptoPrice(
                                        cartShippingTotal,
                                        currencyCode
                                    )}
                                </Text>
                            </HStack>
                        </Flex>
                    )}
                    {/* <Flex justify="space-between" color="gray.300">
                        <Text>Taxes:</Text>
                        <Text>
                            {formatCryptoPrice(
                                orders.reduce(
                                    (total: number, order: ExtendedOrder) =>
                                        total + (order.tax_total || 0),
                                    0
                                ),
                                currencyCode
                            )}
                        </Text>
                    </Flex> */}
                    {cartDiscountTotal > 0 && (
                        <>
                            <Flex justify="space-between" color="gray.300">
                                <Text>Applied Discount Code:</Text>
                                <Flex gap={2}>
                                    {cartDiscountCode
                                        .split(',')
                                        .map((code, index) => (
                                            <Box
                                                key={index}
                                                bg="gray.700"
                                                px={2}
                                                py={0.2}
                                                borderRadius="5px"
                                            >
                                                <Text>{code.trim()}</Text>
                                            </Box>
                                        ))}
                                </Flex>
                            </Flex>
                            <Flex justify="space-between" color="gray.300">
                                <Text>Discount:</Text>
                                <HStack>
                                    <Image
                                        className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                        src={
                                            currencyIcons[
                                                currencyCode ?? 'usdc'
                                            ]
                                        }
                                        alt={currencyCode ?? 'usdc'}
                                    />
                                    <Text>
                                        -{' '}
                                        {formatCryptoPrice(
                                            cartDiscountTotal,
                                            currencyCode
                                        )}
                                    </Text>
                                </HStack>
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
                        <HStack>
                            {hasBitcoinPayment ? (
                                <Icon
                                    as={FaBitcoin}
                                    boxSize="18px"
                                    color="#F7931A"
                                />
                            ) : (
                                <Image
                                    className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                    src={currencyIcons[currencyCode ?? 'usdc']}
                                    alt={currencyCode ?? 'usdc'}
                                />
                            )}
                            <Text>
                                {hasBitcoinPayment
                                    ? bitcoinAmount
                                    : formatCryptoPrice(
                                          totalPaid,
                                          currencyCode
                                      )}
                            </Text>
                        </HStack>
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
                    borderRadius="2rem"
                    _hover={{ backgroundColor: '#86C01E' }}
                >
                    Check Status
                </Button>
            </Link>
        </Flex>
    );
};

export default OrderConfirmed;
