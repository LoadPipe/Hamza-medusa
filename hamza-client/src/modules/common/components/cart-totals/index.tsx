'use client';

import Image from 'next/image';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React, { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider } from '@chakra-ui/react';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { updateShippingCost } from '@lib/data';

type CartTotalsProps = {
    data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
    useCartStyle: boolean;
};

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

const CartTotals: React.FC<CartTotalsProps> = ({ data, useCartStyle }) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const [shippingCost, setShippingCost] = useState<number>(0);

    useEffect(() => {
        let isMounted = true; // Prevent setting state if component unmounts

        const fetchShippingCost = async () => {
            try {
                console.log('Fetching shipping cost...');
                const cost = await updateShippingCost(data.id);
                if (isMounted) {
                    console.log('Shipping cost updated:', cost);
                    setShippingCost(cost);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching shipping cost:', error);
                }
            }
        };

        fetchShippingCost();

        // Cleanup function to cancel updates if unmounted
        return () => {
            isMounted = false;
        };
    }, [data.id]);

    const getCartSubtotal = (cart: any, currencyCode: string) => {
        const subtotals: { [key: string]: number } = {};
        const itemCurrencyCode = currencyCode;

        for (const item of cart.items) {
            const itemPrice = getPriceByCurrency(
                item.variant.prices,
                itemCurrencyCode
            );

            if (itemCurrencyCode?.length) {
                if (!subtotals[itemCurrencyCode]) {
                    subtotals[itemCurrencyCode] = 0;
                }
                const itemTotal =
                    Number(itemPrice) * item.quantity -
                    (item.discount_total ?? 0);
                subtotals[itemCurrencyCode] += itemTotal;
            } else {
                console.log('Currency is missing or invalid for item:', item);
            }
        }

        return subtotals[itemCurrencyCode]
            ? {
                  currency: itemCurrencyCode,
                  amount: subtotals[itemCurrencyCode],
              }
            : { currency: itemCurrencyCode, amount: 0 };
    };

    const finalSubtotal = getCartSubtotal(
        data,
        preferred_currency_code ?? 'usdc'
    );
    const taxTotal = data.tax_total ?? 0;
    const grandTotal = (finalSubtotal.amount ?? 0) + shippingCost + taxTotal;
    const displayCurrency =
        finalSubtotal?.currency || preferred_currency_code || 'usdc';

    return (
        <>
            <Flex flexDirection="column" color="white" my="2rem" gap={4}>
                <Flex justifyContent="space-between">
                    <Text alignSelf="center" fontSize="16px">
                        Subtotal
                    </Text>
                    <Text fontSize="16px" alignSelf="center">
                        {formatCryptoPrice(
                            finalSubtotal.amount,
                            displayCurrency
                        )}
                    </Text>
                </Flex>
                {shippingCost > 0 && (
                    <Flex justifyContent="space-between">
                        <Text alignSelf="center" fontSize="16px">
                            Shipping
                        </Text>
                        <Text fontSize="16px" alignSelf="center">
                            {formatCryptoPrice(shippingCost, displayCurrency)}
                        </Text>
                    </Flex>
                )}
                <Divider my={4} borderColor="#3E3E3E" />
                <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="16px">Total</Text>
                    <Flex flexDirection="row" alignItems="center">
                        <Image
                            className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                            src={currencyIcons[displayCurrency]}
                            alt={displayCurrency}
                        />
                        <Text ml={2} fontSize="24px" fontWeight={700}>
                            {formatCryptoPrice(grandTotal, displayCurrency)}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
};

export default CartTotals;
