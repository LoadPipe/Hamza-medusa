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

    //TODO: this can be replaced later by extending the cart, if necessary
    const getCartSubtotal = (cart: any, currencyCode: string) => {
        const subtotals: { [key: string]: number } = {};
        let itemCurrencyCode: string = '';

        for (let n = 0; n < cart.items.length; n++) {
            const item: ExtendedLineItem = cart.items[n];
            const currency =
                item.currency_code ?? preferred_currency_code ?? 'usdc';
            itemCurrencyCode = currency;

            console.log('preferred_currency_code is', preferred_currency_code);
            console.log('item.currency_code is', item.currency_code);
            console.log('currency for item is', currency);
            if (currency?.length) {
                if (!subtotals[currency]) {
                    subtotals[currency] = 0;
                }
                const itemTotal =
                    item.unit_price * item.quantity -
                    (item.discount_total ?? 0);
                subtotals[currency] += itemTotal;
            } else {
                console.log('Currency is missing or invalid for item:', item);
            }
        }

        console.log('Final subtotals:', subtotals);
        return subtotals[currencyCode]
            ? { currency: currencyCode, amount: subtotals[currencyCode] }
            : {
                  currency: itemCurrencyCode,
                  amount: subtotals[itemCurrencyCode],
              };
    };

    const finalSubtotal = getCartSubtotal(
        data,
        preferred_currency_code ?? 'usdc'
    );
    const shippingCost = shipping_total ?? 0;
    const taxTotal = tax_total ?? 0;
    const grandTotal = (finalSubtotal.amount ?? 0) + shippingCost + taxTotal;

    console.log(grandTotal);
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
                {subtotal && (
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
                                finalSubtotal.amount,
                                finalSubtotal.currency
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
                            finalSubtotal.currency!
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
                        {formatCryptoPrice(
                            taxTotal,
                            finalSubtotal.currency
                        ).toString()}
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
            {finalSubtotal && (
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
                        <Flex alignItems={'center'}>
                            <Image
                                className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                                src={
                                    currencyIcons[
                                        finalSubtotal.currency ?? 'usdc'
                                    ]
                                }
                                alt={finalSubtotal.currency ?? 'usdc'}
                            />
                        </Flex>
                        <Text
                            ml={{ base: '0.4rem', md: '0.5rem' }}
                            fontSize={{ base: '15px', md: '24px' }}
                            fontWeight={700}
                            lineHeight="1.1" // Fine-tune line height
                            position="relative" // Allows for slight adjustments with top
                            top="1px" // Adjust to fine-tune alignment
                        >
                            {formatCryptoPrice(
                                grandTotal,
                                finalSubtotal.currency
                            )}
                        </Text>
                    </Flex>
                </Flex>
            )}
        </div>
    );
};

export default CartTotals;
