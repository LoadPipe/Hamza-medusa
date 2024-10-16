import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Image from 'next/image';

type OrderTotalAmountProps = {
    totalPrice: number;
    currencyCode: string;
    index: number;
    itemCount: number;
};

const OrderTotalAmount: React.FC<OrderTotalAmountProps> = ({
    totalPrice,
    currencyCode,
    index,
    itemCount,
}) => {
    if (index !== itemCount) {
        return null; // Only render for the last item
    }

    const getAmount = (amount?: number | null, currency_code?: string) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, currency_code || 'USDC');
    };

    return (
        <Flex direction={{ sm: 'row', md: 'row' }} gap={2}>
            <Text fontSize={'18px'}>Order total:</Text>
            <Image
                className="h-[14px] w-[14px] md:h-[24px!important] md:w-[24px!important] self-center"
                src={currencyIcons[currencyCode ?? 'usdc']}
                alt={currencyCode?.toUpperCase() ?? 'USDC'}
            />
            <Text fontSize={'18px'}>{getAmount(totalPrice, currencyCode)}</Text>
        </Flex>
    );
};

export default OrderTotalAmount;
