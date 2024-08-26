'use client';

import Image from 'next/image';
import { formatAmount } from '@lib/util/prices';
import { InformationCircleSolid } from '@medusajs/icons';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { Tooltip } from '@medusajs/ui';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React from 'react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { Flex, Text, Divider } from '@chakra-ui/react';
import { getCurrencyIcon } from '@lib/util/get-currency-icon';
import ethImage from '../../../../../public/images/currency-icons/eth.svg';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';

type CartTotalsProps = {
    data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
};

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

const CartTotals: React.FC<CartTotalsProps> = ({ data }) => {
    const {
        subtotal,
        discount_total,
        gift_card_total,
        tax_total,
        shipping_total,
        total,
    } = data;

    const { preferred_currency_code } = useCustomerAuthStore();
    console.log('user preferred currency code: ', preferred_currency_code);

    //TODO: this can be replaced later by extending the cart, if necessary
    const getCartSubtotals = (cart: any) => {
        const subtotals: { [key: string]: number } = {};

        for (let n = 0; n < cart.items.length; n++) {
            const item: ExtendedLineItem = cart.items[n];
            const currency =
                preferred_currency_code ?? item.currency_code ?? 'usdc';

            if (currency?.length) {
                subtotals[currency] = subtotals[currency] ?? 0;
                subtotals[currency] +=
                    item.unit_price * item.quantity -
                    (item.discount_total ?? 0);
            }
        }

        return subtotals;
    };

    const subtotals = getCartSubtotals(data);
    const currencyCode = preferred_currency_code ?? 'usdc';
    const shippingCost = shipping_total ?? 0;
    const taxTotal = tax_total ?? 0;
    const grandTotal = (subtotals[currencyCode] ?? 0) + shippingCost + taxTotal;

    return (
        <div>
            <hr
                style={{
                    color: 'red',
                    width: '100%',
                    borderTop: '2px solid #3E3E3E',
                    marginBottom: '1rem',
                }}
            />
            {/* amounts */}
            <Flex flexDirection={'column'} color="white">
                {subtotals[currencyCode] && (
                    <Flex justifyContent={'space-between'}>
                        <Text
                            alignSelf={'center'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Subtotal
                        </Text>

                        <Text
                            fontSize={{ base: '14px', md: '16px' }}
                            alignSelf="center"
                        >
                            {formatCryptoPrice(
                                subtotals[currencyCode],
                                currencyCode
                            )}
                        </Text>
                    </Flex>
                )}

                {!!discount_total && (
                    <div className="flex items-center justify-between">
                        <span>Discount</span>
                    </div>
                )}
                {!!gift_card_total && (
                    <div className="flex items-center justify-between">
                        <span>Gift card</span>
                    </div>
                )}

                <Flex justifyContent={'space-between'}>
                    <Text
                        alignSelf={'center'}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
                        Shipping
                    </Text>

                    <Text
                        fontSize={{ base: '14px', md: '16px' }}
                        alignSelf="center"
                    >
                        {formatCryptoPrice(
                            shippingCost!,
                            currencyCode!
                        ).toString()}
                    </Text>
                </Flex>

                {/* final total */}
                <Flex justifyContent={'space-between'}>
                    <Text
                        alignSelf={'center'}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
                        Taxes
                    </Text>

                    <Text
                        fontSize={{ base: '14px', md: '16px' }}
                        alignSelf="center"
                    >
                        {formatCryptoPrice(taxTotal, currencyCode).toString()}
                    </Text>
                </Flex>
            </Flex>
            {/* <div className="h-px w-full border-b border-gray-200 mt-4" /> */}
            <hr
                style={{
                    color: 'red',
                    width: '100%',
                    borderTop: '2px dashed #3E3E3E',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                }}
            />
            {subtotals[currencyCode] && (
                <Flex
                    color={'white'}
                    justifyContent={'space-between'}
                    alignItems="center"
                >
                    <Text
                        alignSelf="center"
                        fontSize={{ base: '15px', md: '16px' }}
                    >
                        Total
                    </Text>
                    <Flex flexDirection={'row'} alignItems="center">
                        <Flex mb="1px">
                            <Image
                                height={20}
                                width={20}
                                src={currencyIcons[currencyCode]}
                                alt="eth"
                            />
                        </Flex>
                        <Text
                            ml="7px"
                            fontSize={{ base: '15px', md: '24px' }}
                            fontWeight={700}
                        >
                            {formatCryptoPrice(grandTotal, currencyCode)}
                        </Text>
                    </Flex>
                </Flex>
            )}
        </div>
    );
};

export default CartTotals;
