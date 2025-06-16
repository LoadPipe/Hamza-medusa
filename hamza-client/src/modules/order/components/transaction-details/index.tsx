'use client';

import { Cart, Order, LineItem } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React, { useState } from 'react';
import { Flex, Text, Divider, Spinner } from '@chakra-ui/react';
import Image from 'next/image';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { convertPrice } from '@/lib/util/price-conversion';
import { currencyIsUsdStable } from '@/lib/util/currencies';

type CartTotalsProps = {
    data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
};

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

const TransactionDetails: React.FC<CartTotalsProps> = ({ data }) => {
    const { tax_total, shipping_total } = data;
    const [usdPrice, setUsdPrice] = useState<string>('');

    //TODO: this can be replaced later by extending the cart, if necessary
    const getCartSubtotals = (cart: any) => {
        const subtotals: { [key: string]: number } = {};

        for (let n = 0; n < cart.items.length; n++) {
            const item: ExtendedLineItem = cart.items[n];

            const currency = item.currency_code ?? 'usdc';

            if (currency.length) {
                subtotals[currency] = subtotals[currency] ?? 0;
                subtotals[currency] +=
                    item.unit_price * item.quantity -
                    (item.discount_total ?? 0);
            }
        }

        return subtotals;
    };

    const subtotals = getCartSubtotals(data);
    const currencyCode = data?.items[0]?.currency_code ?? 'usdc';
    const shippingCost = shipping_total ?? 0;
    const taxTotal = tax_total ?? 0;
    const grandTotal = (subtotals[currencyCode] ?? 0) + shippingCost + taxTotal;

    // Convert grand total to USD

    React.useEffect(() => {
        const fetchConvertedPrice = async () => {
            const result = await convertPrice(
                Number(formatCryptoPrice(grandTotal, currencyCode)),
                currencyCode,
                'usdc'
            );
            const formattedResult = Number(result).toFixed(2);
            setUsdPrice(formattedResult);
        };

        if (!currencyIsUsdStable(currencyCode)) {
            fetchConvertedPrice();
        }
    }, [grandTotal, currencyCode]);

    return (
        <Flex width={'100%'} flexDir={'column'} mt="2rem">
            <Flex
                flexDirection={'column'}
                color="white"
                width={'100%'}
                gap={'8px'}
            >
                {/* Discount */}
                <Flex color="#555555" justifyContent={'space-between'}>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Discount
                    </Text>

                    <Flex>
                        <Text fontSize={{ base: '14px', md: '16px' }}> - </Text>
                    </Flex>
                </Flex>

                {/* Taxes */}
                <Flex color="#555555" justifyContent={'space-between'}>
                    <Text fontSize={{ base: '14px', md: '16px' }}>Taxes</Text>

                    <Flex>
                        <Image
                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                            src={currencyIcons[currencyCode ?? 'usdc']}
                            alt={currencyCode ?? 'usdc'}
                        />
                        <Text
                            ml="0.4rem"
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            {formatCryptoPrice(
                                taxTotal,
                                currencyCode
                            ).toString()}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Divider my="1rem" borderColor="#555555" />

            {/* Grand Total */}
            <Flex width={'100%'} justifyContent={'space-between'}>
                <Text>Grand Total</Text>

                <Flex flexDir={'column'} gap={2}>
                    <Flex>
                        <Image
                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                            src={currencyIcons[currencyCode ?? 'usdc']}
                            alt={currencyCode ?? 'usdc'}
                        />
                        <Text ml="0.4rem">
                            {formatCryptoPrice(grandTotal, currencyCode)}
                        </Text>
                    </Flex>

                    {!currencyIsUsdStable(currencyCode) && (
                        <Flex ml={'auto'}>
                            {usdPrice === '' ? (
                                <Spinner size="sm" color="white" />
                            ) : (
                                <Text>≅ ${usdPrice} USD</Text>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default TransactionDetails;
