import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Image from 'next/image';
import { convertPrice } from '@/lib/util/price-conversion';
import { Spinner } from '@chakra-ui/react';

type PaymentTotal = {
    amount?: number | null;
    currency_code?: string;
};

type OrderTotalAmountProps = {
    subTotal: number;
    currencyCode: string;
    index: number;
    itemCount: number;
    paymentTotal?: PaymentTotal | null;
};

const OrderTotalAmount: React.FC<OrderTotalAmountProps> = ({
    subTotal,
    currencyCode,
    index,
    itemCount,
    paymentTotal,
}) => {
    const [usdPrice, setUsdPrice] = useState('');
    useEffect(() => {
        const fetchConvertedPrice = async () => {
            if (subTotal && currencyCode.toLowerCase() === 'eth') {
                try {
                    const result = await convertPrice(
                        Number(formatCryptoPrice(subTotal, 'eth')),
                        'eth',
                        'usdc'
                    );
                    const formattedResult = Number(result).toFixed(2);
                    setUsdPrice(formattedResult);
                } catch (error) {
                    console.error('Error converting price:', error);
                    setUsdPrice('Error');
                }
            }
        };

        fetchConvertedPrice();
    }, [subTotal, currencyCode]);

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
        <Flex
            direction={'row'}
            gap={2}
            flexWrap={'nowrap'}
            alignItems={'center'}
        >
            <Text fontSize={'18px'} lineHeight="36px" whiteSpace="nowrap">
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
            <Text fontSize={'18px'} lineHeight="36px" fontWeight={700}>
                {getAmount(amount, currency_code)}
            </Text>

            {/* {currencyCode === 'eth' && (
                <Flex gap={2}>
                    {usdPrice === '' ? (
                        <Spinner size="sm" color="gray.300" />
                    ) : (
                        <Text> ≅ ${usdPrice} USD</Text>
                    )}
                </Flex>
            )} */}
        </Flex>
    );

    if (!paymentTotal) {
        return renderOrderTotal('Mock Order total:', subTotal, currencyCode);
    }

    return renderOrderTotal(
        'Order total:',
        paymentTotal.amount,
        paymentTotal.currency_code || 'USDC'
    );
};

export default OrderTotalAmount;
