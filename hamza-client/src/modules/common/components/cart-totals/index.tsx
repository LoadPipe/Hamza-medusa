'use client';

import Image from 'next/image';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React, { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider } from '@chakra-ui/react';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { getCartShippingCost } from '@lib/data';
import { useCartShippingOptions } from 'medusa-react';
import axios from 'axios';
import { getClientCookie } from '@lib/util/get-client-cookies';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';

type CartTotalsProps = {
    data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
    useCartStyle: boolean;
};

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

const CartTotals: React.FC<CartTotalsProps> = ({ data, useCartStyle }) => {
    const {
        subtotal,
        discount_total,
        gift_card_total,
        tax_total,
        shipping_total,
        total,
    } = data;

    const { preferred_currency_code } = useCustomerAuthStore();
    const [shippingCost, setShippingCost] = useState<number>(0);
    const { shipping_options, isLoading } = useCartShippingOptions(data.id);

    const updateShippingCost = () => {
        const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/cart/shipping`;
        axios
            .get(url, {
                params: { cart_id: getClientCookie('_medusa_cart_id') },
                headers: {
                    authorization: getClientCookie('_medusa_jwt'),
                },
            })
            .then((response) => {
                setShippingCost(response?.data?.amount ?? 0);
            });
    };

    useEffect(() => {
        updateShippingCost();
    }, [shipping_options, isLoading]);

    //TODO: this can be replaced later by extending the cart, if necessary
    const getCartSubtotal = (cart: any, currencyCode: string) => {
        const subtotals: { [key: string]: number } = {};
        const itemCurrencyCode: string = currencyCode;

        updateShippingCost();

        for (let n = 0; n < cart.items.length; n++) {
            const item: ExtendedLineItem = cart.items[n];

            // Find the price for the selected currency....
            const itemPrice = getPriceByCurrency(
                item.variant.prices,
                itemCurrencyCode
            );

            console.log(
                `itemCurrencyCode ${itemCurrencyCode} item Price: ${itemPrice}`
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
            : {
                  currency: itemCurrencyCode,
                  amount: subtotals[itemCurrencyCode],
              };
    };

    const finalSubtotal = getCartSubtotal(
        data,
        preferred_currency_code ?? 'usdc'
    );

    const usdShippingCost = shippingCost ? 500 : 0; //TODO: hard-coded for now
    const taxTotal = tax_total ?? 0;
    const grandTotal = (finalSubtotal.amount ?? 0) + shippingCost + taxTotal;
    const displayCurrency = finalSubtotal?.currency?.length
        ? finalSubtotal.currency
        : preferred_currency_code ?? 'usdc';

    // TODO: when we set shipping / tax we can then enhance this...
    let usdSubtotal: { currency: string; amount: number };
    let usdGrandTotal: number = 0;
    if (preferred_currency_code === 'eth') {
        usdSubtotal = getCartSubtotal(data, 'usdc');
        usdGrandTotal = (usdSubtotal.amount ?? 0) + usdShippingCost + taxTotal;
    }
    return (
        <>
            {/* amounts */}
            <Flex
                flexDirection={'column'}
                color="white"
                my="2rem"
                gap={{ base: 2, md: 4 }}
            >
                {finalSubtotal && (
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
                                displayCurrency
                            )}
                        </Text>
                    </Flex>
                )}

                {!!discount_total && (
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        <span>Discount</span>
                    </Text>
                )}
                {!!gift_card_total && (
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Gift Card
                    </Text>
                )}

                {shippingCost ? (
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
                                displayCurrency
                            ).toString()}
                        </Text>
                    </Flex>
                ) : (
                    <Flex mt="-1rem" justifyContent={'space-between'}></Flex>
                )}

                {/* final total 
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
                            displayCurrency
                        ).toString()}
                    </Text>
                </Flex>*/}
            </Flex>
            {/* <div className="h-px w-full border-b border-gray-200 mt-4" /> */}
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

            {finalSubtotal?.currency && (
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
                    <Flex flexDirection="column" alignItems="flex-end">
                        <Flex flexDirection={'row'} alignItems="center">
                            <Flex alignItems={'center'}>
                                <Image
                                    className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                                    src={currencyIcons[displayCurrency]}
                                    alt={displayCurrency}
                                />
                            </Flex>
                            <Text
                                ml={{ base: '0.4rem', md: '0.5rem' }}
                                fontSize={{ base: '15px', md: '24px' }}
                                fontWeight={700}
                                lineHeight="1.1"
                                position="relative"
                                top="1px"
                            >
                                {formatCryptoPrice(grandTotal, displayCurrency)}
                            </Text>
                        </Flex>
                        {preferred_currency_code === 'eth' &&
                            (!useCartStyle ? (
                                <Flex justifyContent="flex-end" width="100%">
                                    <Text
                                        as="h3"
                                        variant="semibold"
                                        color="white"
                                        mt={2}
                                        fontSize={{ base: '15px', md: '18px' }}
                                        fontWeight={700}
                                        textAlign="right"
                                    >
                                        {`≅ $ ${formatCryptoPrice(usdGrandTotal, 'usdc')} USDC`}
                                    </Text>
                                </Flex>
                            ) : (
                                <Flex justifyContent="flex-end" width="100%">
                                    <Text
                                        as="h3"
                                        color="white"
                                        mt={2}
                                        fontSize={{ base: '14px', md: '16px' }}
                                        fontWeight={600}
                                        textAlign="right"
                                    >
                                        {`≅ $ ${formatCryptoPrice(usdGrandTotal, 'usdc')} USDC`}
                                    </Text>
                                </Flex>
                            ))}
                    </Flex>
                </Flex>
            )}
        </>
    );
};

export default CartTotals;
