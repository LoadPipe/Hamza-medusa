import React from 'react';
import { Box, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { upperCase } from 'lodash';
import Image from 'next/image';
import {
    getChainLogo,
    chainIdToName,
} from '@modules/order/components/chain-enum/chain-enum';
import { FaBitcoin } from 'react-icons/fa';
import currencyIcons from '@/images/currencies/crypto-currencies';

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

interface Payment {
    metadata?: {
        currency?: string;
        amount?: string;
        chainType?: string;
        chainId?: string;
    };
    amount?: number;
}

interface Order {
    id: string;
    tracking_number?: string;
    items: OrderItem[] | any;
    store: OrderStore;
    payments: Payment[];
    external_metadata?: {
        tracking?: {
            data?: {
                soOrderInfo?: {
                    createTime?: string;
                };
            };
        };
    };
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

    const getBitcoinPaymentInfo = () => {
        let hasBitcoinPayment = false;
        let bitcoinAmount: string = '';

        if (order.payments) {
            order.payments.forEach(payment => {
                if (payment.metadata?.currency === 'btc') {
                    hasBitcoinPayment = true;
                    bitcoinAmount = payment.metadata.amount ?? '';
                }
            });
        }

        return { hasBitcoinPayment, bitcoinAmount };
    };

    const { hasBitcoinPayment, bitcoinAmount } = getBitcoinPaymentInfo();

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

    // Helper function to render amount with appropriate icon
    const renderAmountWithIcon = (amount: number, label: string, showMinus = false) => (
        <Flex fontSize="md" alignItems="center" gap={2}>
            <Text fontWeight="bold">{label}:</Text>
            {showMinus && <Text>-</Text>}
            {hasBitcoinPayment ? (
                <Icon as={FaBitcoin} boxSize="16px" color="#F7931A" />
            ) : (
                <Image
                    src={currencyIcons[currencyCode.toLowerCase()] ?? currencyIcons['usdc']}
                    alt={currencyCode.toUpperCase()}
                    width={16}
                    height={16}
                />
            )}
            <Text>
                {hasBitcoinPayment
                    ? bitcoinAmount
                    : `${formatCryptoPrice(amount, currencyCode)} ${upperCase(currencyCode)}`
                }
            </Text>
        </Flex>
    );

    return (
        <VStack align="start" spacing={4} p={4} borderRadius="lg" w="100%">
            <Flex direction={{ base: 'column', md: 'row' }} gap={6} w="100%">
                {/* Left Column: Shipping Cost & Subtotal */}
                <VStack align="start" spacing={2} flex="1">
                    {order.tracking_number && (
                        <Text>
                            <b>Tracking Number:</b> {order.tracking_number}
                        </Text>
                    )}

                    {renderAmountWithIcon(numericSubTotal, "Subtotal")}

                    {numericDiscountTotal > 0 &&
                        renderAmountWithIcon(numericDiscountTotal, "Order Discount Total", true)
                    }

                    {numericShippingTotal > 0 &&
                        renderAmountWithIcon(numericShippingTotal, "Order Shipping Cost")
                    }

                    {order.external_metadata?.tracking?.data?.soOrderInfo
                        ?.createTime && (
                            <Flex alignItems="center">
                                <Text fontWeight="bold" mr={2}>
                                    Shipped on Date:
                                </Text>
                                <Text>
                                    {new Date(
                                        order.external_metadata.tracking.data.soOrderInfo.createTime
                                    ).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </Text>
                            </Flex>
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
                        {hasBitcoinPayment ? (
                            <>
                                <Icon as={FaBitcoin} boxSize="20px" color="#F7931A" />
                                <Text>Bitcoin</Text>
                            </>
                        ) : (
                            <>
                                <Image
                                    src={getChainLogo(parseInt(chainId))}
                                    alt={chainIdToName(parseInt(chainId))}
                                    width={25}
                                    height={25}
                                />
                                <Text>{chainIdToName(parseInt(chainId))}</Text>
                            </>
                        )}
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
