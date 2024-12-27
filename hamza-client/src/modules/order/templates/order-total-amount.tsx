import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Image from 'next/image';

type PaymentTotal = {
    amount?: number | null;
    currency_code?: string;
};

type OrderTotalAmountProps = {
    totalPrice: number;
    currencyCode: string;
    index: number;
    itemCount: number;
    paymentTotal?: PaymentTotal | null;
};

const OrderTotalAmount: React.FC<OrderTotalAmountProps> = ({
    totalPrice,
    currencyCode,
    index,
    itemCount,
    paymentTotal,
}) => {
    if (index !== itemCount) {
        return null; // Only render for the last item
    }

    const getAmount = (amount?: number | null, currency_code?: string) => {
        if (amount === null || amount === undefined) {
            return 'N/A'; // Provide a meaningful fallback
        }

        return formatCryptoPrice(amount, currency_code || 'USDC');
    };

    const renderOrderTotal = (
        title: string,
        amount: number | null | undefined,
        currency_code: string
    ) => (
        <Flex direction={'row'} gap={2} flexWrap={'nowrap'}>
            <Flex
                direction={'row'}
                gap={2}
                alignItems={'center'}
                flexWrap={'nowrap'}
            >
                <Text fontSize={'18px'} whiteSpace="nowrap">
                    {title}
                </Text>
                <Image
                    src={
                        currencyIcons[currency_code.toLowerCase()] ??
                        currencyIcons['usdc']
                    }
                    alt={currency_code.toUpperCase()}
                    width={16}
                    height={16}
                />
                <Text fontSize={'18px'} whiteSpace="nowrap">
                    {getAmount(amount, currency_code)}
                </Text>
            </Flex>
        </Flex>
    );

    if (!paymentTotal) {
        return renderOrderTotal('Mock Order total:', totalPrice, currencyCode);
    }

    return renderOrderTotal(
        'Order total:',
        paymentTotal.amount,
        paymentTotal.currency_code || 'USDC'
    );
};

export default OrderTotalAmount;
