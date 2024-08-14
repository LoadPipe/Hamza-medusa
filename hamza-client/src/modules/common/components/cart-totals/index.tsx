'use client';

import { formatAmount } from '@lib/util/prices';
import { InformationCircleSolid } from '@medusajs/icons';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { Tooltip } from '@medusajs/ui';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React from 'react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { Flex, Text, Divider } from '@chakra-ui/react';

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

    const getAmount = (amount: number | null | undefined) => {
        return formatAmount({
            amount: amount || 0,
            region: data.region,
            includeTaxes: false,
            currency_code: '',
        });
    };

    //TODO: this can be replaced later by extending the cart, if necessary
    const getCartSubtotals = (cart: any) => {
        const subtotals: { [key: string]: number } = {};

        for (let n = 0; n < cart.items.length; n++) {
            const item: ExtendedLineItem = cart.items[n];
            const currency: string = item.currency_code ?? '';
            if (currency.length) {
                subtotals[currency] = subtotals[currency] ?? 0;
                subtotals[currency] += item.unit_price * item.quantity;
            }
        }

        return subtotals;
    };

    const subtotals = getCartSubtotals(data);

    return (
        <div>
            <hr
                style={{
                    color: 'red',
                    width: '100%',
                    borderTop: '2px dashed #3E3E3E',
                    marginBottom: '1rem',
                }}
            />
            <Flex flexDirection={'column'} color="white">
                {subtotals['eth'] && (
                    <Flex color={'white'}>
                        <Text fontSize={{ md: '16px' }}>Subtotal</Text>
                        <Text ml="auto" fontSize={'16px'}>
                            {formatCryptoPrice(subtotals['eth'], 'eth')} ETH
                        </Text>
                    </Flex>
                )}
                {subtotals['usdt'] && (
                    <Flex color={'white'}>
                        <Text fontSize={{ md: '16px' }}>Subtotal</Text>
                        <Text ml="auto" fontSize={'16px'}>
                            {formatCryptoPrice(subtotals['usdt'], 'usdt')} USDT
                        </Text>
                    </Flex>
                )}
                {subtotals['usdc'] && (
                    <Flex color={'white'}>
                        <Text fontSize={{ md: '16px' }}>Subtotal</Text>
                        <Text ml="auto" fontSize={'16px'}>
                            {formatCryptoPrice(subtotals['usdc'], 'usdc')} USDC
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
                <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>
                        {formatCryptoPrice(
                            shipping_total!,
                            preferred_currency_code!
                        ).toString()}{' '}
                        {preferred_currency_code?.toUpperCase()}
                    </span>
                </div>
                <Flex className="flex justify-between">
                    <Text fontSize={{ md: '16px' }}>Taxes</Text>
                    <Text ml="auto">{getAmount(tax_total).toString()}</Text>
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
            {subtotals['eth'] && (
                <Flex color={'white'}>
                    <Text fontSize={{ md: '16px' }} alignSelf={'center'}>
                        Total
                    </Text>
                    <Text ml="auto" fontSize={'24px'} fontWeight={700}>
                        {formatCryptoPrice(subtotals['eth'], 'eth')} ETH
                    </Text>
                </Flex>
            )}
            {subtotals['usdt'] && (
                <Flex color={'white'}>
                    <Text fontSize={{ md: '16px' }} alignSelf={'center'}>
                        Total
                    </Text>
                    <Text ml="auto" fontSize={'24px'} fontWeight={700}>
                        {formatCryptoPrice(subtotals['usdt'], 'usdt')} USDT
                    </Text>
                </Flex>
            )}
            {subtotals['usdc'] && (
                <Flex color={'white'}>
                    <Text fontSize={{ md: '16px' }} alignSelf={'center'}>
                        Total
                    </Text>
                    <Text ml="auto" fontSize={'24px'} fontWeight={700}>
                        {formatCryptoPrice(subtotals['usdc'], 'usdc')} USDC
                    </Text>
                </Flex>
            )}
        </div>
    );
};

export default CartTotals;
