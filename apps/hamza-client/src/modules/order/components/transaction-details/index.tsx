'use client';

import { formatAmount } from '@lib/util/prices';
import { InformationCircleSolid } from '@medusajs/icons';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { Tooltip } from '@medusajs/ui';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider } from '@chakra-ui/react';
import Image from 'next/image';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
type CartTotalsProps = {
    data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
};

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

const TransactionDetails: React.FC<CartTotalsProps> = ({ data }) => {
    const { tax_total, shipping_total } = data;

    console.log(`Shipping Total ${shipping_total}`);
    //console.log('user preferred currency code: ', preferred_currency_code);

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
    console.log(subtotals);

    return (
        <Flex width={'100%'} flexDir={'column'} mt="2rem">
            <Flex
                flexDirection={'column'}
                color="white"
                width={'100%'}
                gap={'8px'}
            >
                {subtotals[currencyCode] && (
                    <Flex flexDir={'column'}>
                        <Flex color={'white'} justifyContent={'space-between'}>
                            <Text fontSize={{ base: '14px', md: '16px' }}>
                                Subtotal
                            </Text>
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
                                        subtotals[currencyCode ?? 'usdc'],
                                        currencyCode ?? 'usdc'
                                    )}
                                </Text>
                            </Flex>
                        </Flex>
                        <Divider my="1rem" borderColor="#555555" />
                    </Flex>
                )}
                {/* Discount */}
                <Flex color="#555555" justifyContent={'space-between'}>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Discount
                    </Text>

                    <Flex>
                        <Text fontSize={{ base: '14px', md: '16px' }}> - </Text>
                    </Flex>
                </Flex>

                {/* Shipping Fee */}
                <Flex color="#555555" justifyContent={'space-between'}>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Shipping Fee
                    </Text>

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
                                shippingCost!,
                                currencyCode!
                            ).toString()}
                        </Text>
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
            </Flex>
        </Flex>
    );
};

export default TransactionDetails;
