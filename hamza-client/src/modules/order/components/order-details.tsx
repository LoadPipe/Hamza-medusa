import React from 'react';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { upperCase } from 'lodash';
import Image from 'next/image';
import {
    getChainLogo,
    chainIdToName,
} from '@modules/order/components/chain-enum/chain-enum';

interface OrderItem {
    id: string;
    currency_code: string;
    unit_price: number;
    quantity: number;
}

interface OrderStore {
    handle: string;
    name: string;
    icon: string;
}

interface Order {
    id: string;
    tracking_number?: string;
    items: OrderItem[];
    store: OrderStore;
}

interface OrderDetailsProps {
    order: Order;
    subTotal: number;
    orderDiscountTotal: number;
    orderShippingTotal: number;
    chainId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
    order,
    subTotal,
    orderDiscountTotal,
    orderShippingTotal,
    chainId,
}) => {
    const currencyCode = order.items[0]?.currency_code ?? 'usdc';

    // Convert any string values to numbers
    const numericSubTotal =
        typeof subTotal === 'string' ? parseFloat(subTotal) : subTotal;
    const numericDiscountTotal =
        typeof orderDiscountTotal === 'string'
            ? parseFloat(orderDiscountTotal)
            : orderDiscountTotal;
    const numericShippingTotal =
        typeof orderShippingTotal === 'string'
            ? parseFloat(orderShippingTotal)
            : orderShippingTotal;

    return (
        <VStack align="start" spacing={4} p={4} borderRadius="lg" w="100%">
            <Flex direction={{ base: 'column', md: 'row' }} gap={6} w="100%">
                {/* Left Column: Shipping Cost & Subtotal */}
                <VStack align="start" spacing={2} flex="1">
                    <Flex>
                        {order.tracking_number && (
                            <Text>
                                <b>Tracking Number:</b> {order.tracking_number}
                            </Text>
                        )}
                    </Flex>
                    <Text fontSize="md">
                        <strong>Subtotal:</strong>{' '}
                        {formatCryptoPrice(numericSubTotal, currencyCode)}{' '}
                        {upperCase(currencyCode)}
                    </Text>
                    {numericDiscountTotal > 0 && (
                        <Text fontSize="md">
                            <strong>Order Discount Total:</strong>
                            {' -'}
                            {formatCryptoPrice(
                                numericDiscountTotal,
                                currencyCode
                            )}{' '}
                            {upperCase(currencyCode)}
                        </Text>
                    )}
                    {numericShippingTotal > 0 && (
                        <Text fontSize="md">
                            <strong>Order Shipping Cost:</strong>{' '}
                            {formatCryptoPrice(
                                numericShippingTotal,
                                currencyCode
                            )}{' '}
                            {upperCase(currencyCode)}
                        </Text>
                    )}
                </VStack>

                {/* Right Column: Order ID & Chain Data */}
                <VStack align="start" spacing={2} flex="1">
                    <Flex align="center" gap={2}>
                        <Text fontSize="md">
                            <strong>Order ID:</strong>{' '}
                            {order?.id && typeof order.id === 'string'
                                ? order.id.replace(/^order_/, '') // Remove "order_" prefix
                                : 'Order ID not available'}
                        </Text>
                    </Flex>

                    <Flex align="center" gap={2}>
                        <strong>Order Chain:</strong>
                        <Image
                            src={getChainLogo(parseInt(chainId))}
                            alt={chainIdToName(parseInt(chainId))}
                            width={25}
                            height={25}
                        />
                        <Text>{chainIdToName(parseInt(chainId))}</Text>
                    </Flex>

                    <Flex align="center" gap={2}>
                        <a
                            href={
                                process.env.NEXT_PUBLIC_HAMZA_CHAT_LINK
                                    ? `${process.env.NEXT_PUBLIC_HAMZA_CHAT_LINK}?target=${order.store.handle}.hamzamarket&order=${order.id}`
                                    : 'https://support.hamza.market/help/1568263160'
                            }
                            target="_blank"
                        >
                            <Text fontSize="md" color="#ADD8E6">
                                <strong>Chat with Merchant</strong>{' '}
                            </Text>
                        </a>
                    </Flex>
                </VStack>
            </Flex>
        </VStack>
    );
};

export default OrderDetails;
