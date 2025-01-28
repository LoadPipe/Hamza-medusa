'use client';

import Image from 'next/image';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { convertPrice } from '@/lib/util/price-conversion';
import React, { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider, Spinner } from '@chakra-ui/react';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { updateShippingCost } from '@lib/data';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';

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
    const [loading, setLoading] = useState<boolean>(false);
    const [convertedPrice, setConvertedPrice] = useState<string | null>(null);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    useEffect(() => {
        const fetchShippingCost = async () => {
            setLoading(true);
            try {
                const cost = await updateShippingCost(data.id);
                setShippingCost(cost);
            } catch (error) {
                console.error('Error fetching shipping cost:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShippingCost();
    }, [data.id, preferred_currency_code]);

    const getCartSubtotal = (cart: any, currencyCode: string) => {
        const subtotals: { [key: string]: number } = {};
        for (const item of cart.items) {
            const itemPrice = getPriceByCurrency(
                item.variant.prices,
                currencyCode
            );
            if (currencyCode) {
                subtotals[currencyCode] =
                    (subtotals[currencyCode] || 0) +
                    (Number(itemPrice) * item.quantity -
                        (item.discount_total ?? 0));
            }
        }
        return subtotals[currencyCode]
            ? { currency: currencyCode, amount: subtotals[currencyCode] }
            : { currency: currencyCode, amount: 0 };
    };

    const finalSubtotal = getCartSubtotal(
        data,
        preferred_currency_code ?? 'usdc'
    );
    const taxTotal = data.tax_total ?? 0;

    useEffect(() => {
        const updatedGrandTotal =
            (finalSubtotal.amount ?? 0) + shippingCost + taxTotal;
        setGrandTotal(updatedGrandTotal);

        const fetchConvertedPrice = async () => {
            const result = await convertPrice(
                Number(
                    formatCryptoPrice(
                        updatedGrandTotal,
                        preferred_currency_code ?? 'usdc'
                    )
                ),
                'eth',
                'usdc'
            );
            setConvertedPrice(Number(result).toFixed(2));
        };

        if (preferred_currency_code === 'eth' && updatedGrandTotal > 0) {
            fetchConvertedPrice();
        }
    }, [finalSubtotal.amount, shippingCost, taxTotal, preferred_currency_code]);

    return (
        <>
            <Flex
                flexDirection={'column'}
                color="white"
                my="2rem"
                gap={{ base: 2, md: 4 }}
            >
                <Flex justifyContent={'space-between'}>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Subtotal
                    </Text>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        {formatCryptoPrice(
                            finalSubtotal.amount,
                            finalSubtotal.currency
                        )}
                    </Text>
                </Flex>

                {shippingCost ? (
                    <Flex justifyContent={'space-between'}>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            Shipping
                        </Text>
                        {loading ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text fontSize={{ base: '14px', md: '16px' }}>
                                {formatCryptoPrice(
                                    shippingCost,
                                    finalSubtotal.currency
                                )}
                            </Text>
                        )}
                    </Flex>
                ) : null}
            </Flex>

            {!useCartStyle ? (
                <hr
                    style={{
                        color: 'red',
                        width: '100%',
                        borderTop: '2px dashed #3E3E3E',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}
                />
            ) : (
                <Divider
                    my={{ base: '1rem', md: '1rem' }}
                    borderWidth={'1px'}
                    borderColor={'#3E3E3E'}
                />
            )}

            <Flex
                color={'white'}
                justifyContent={'space-between'}
                alignItems="center"
            >
                <Text fontSize={{ base: '15px', md: '16px' }}>Total</Text>
                {loading ? (
                    <Spinner size="sm" color="white" />
                ) : (
                    <Flex flexDirection="column" alignItems="flex-end">
                        <Flex flexDirection={'row'} alignItems="center">
                            <Image
                                className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                                src={currencyIcons[finalSubtotal.currency]}
                                alt={finalSubtotal.currency}
                            />
                            <Text
                                ml={{ base: '0.4rem', md: '0.5rem' }}
                                fontSize={{ base: '15px', md: '24px' }}
                                fontWeight={700}
                            >
                                {formatCryptoPrice(
                                    grandTotal,
                                    finalSubtotal.currency
                                )}
                            </Text>
                        </Flex>
                        {preferred_currency_code === 'eth' ? (
                            convertedPrice === null ? (
                                <Spinner size="sm" color="white" />
                            ) : (
                                <Flex justifyContent="flex-end" width="100%">
                                    <Text
                                        as="h3"
                                        variant="semibold"
                                        color="white"
                                        mt={2}
                                        fontSize={{ base: '15px', md: '18px' }}
                                        fontWeight={700}
                                    >
                                        {`≅ $${convertedPrice} USD`}
                                    </Text>
                                </Flex>
                            )
                        ) : null}
                    </Flex>
                )}
            </Flex>
        </>
    );
};

export default CartTotals;
