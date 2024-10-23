'use client';

import Image from 'next/image';
import { Cart, Order, LineItem } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import React from 'react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { Flex, Text, Divider } from '@chakra-ui/react';
import currencyIcons from '../../../../../../public/images/currencies/crypto-currencies';

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
        const itemCurrencyCode: string = currencyCode;

        for (let n = 0; n < cart.items.length; n++) {
            const item: ExtendedLineItem = cart.items[n];

            // Find the price for the selected currency....

            const variantPrice = item.variant.prices.find(
                (p: any) => p.currency_code == itemCurrencyCode
            );
            const itemPrice = variantPrice.amount;

            console.log(
                `itemCurrencyCode ${itemCurrencyCode} item Price: ${itemPrice}`
            );
            if (itemCurrencyCode?.length) {
                if (!subtotals[itemCurrencyCode]) {
                    subtotals[itemCurrencyCode] = 0;
                }
                const itemTotal =
                    itemPrice * item.quantity - (item.discount_total ?? 0);
                subtotals[itemCurrencyCode] += itemTotal;
            } else {
                console.log('Currency is missing or invalid for item:', item);
            }
        }

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
    const usdShippingCost = shippingCost ? 500 : 0; //TODO: hard-coded for now
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

    // console.log(grandTotal);
    return (
        <>
            {/* amounts */}
            <Flex my="2rem" flexDir="column" gap={{ base: 2, md: 4 }}>
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
                                displayCurrency
                            )}
                        </Text>
                    </Flex>
                )}

                {!!discount_total && (
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Discount
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
                            Shipping Fee
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
                    <Flex justifyContent={'space-between'}>
                        <Text
                            alignSelf={'center'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Shipping Fee
                        </Text>

                        <Text
                            fontSize={{ base: '14px', md: '16px' }}
                            alignSelf="center"
                        >
                            0.00
                        </Text>
                    </Flex>
                )}

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
                </Flex>
                <Divider
                    my={{ base: '1rem', md: '0' }}
                    borderWidth={'1px'}
                    borderColor={'#3E3E3E'}
                />
                {finalSubtotal?.currency && (
                    <Flex flexDir={'column'}>
                        <Flex
                            color={'white'}
                            justifyContent={'space-between'}
                            alignItems="center"
                        >
                            <Text
                                alignSelf="center"
                                fontSize={{ base: '14px', md: '16px' }}
                            >
                                Total
                            </Text>
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
                                    lineHeight="1.1" // Fine-tune line height
                                    position="relative" // Allows for slight adjustments with top
                                    top="1px" // Adjust to fine-tune alignment
                                >
                                    {formatCryptoPrice(
                                        grandTotal,
                                        displayCurrency
                                    )}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" alignItems="flex-end">
                            {preferred_currency_code === 'eth' && (
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
                                        {`$ ${formatCryptoPrice(usdGrandTotal, 'usdc')}`}
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </>
    );
};

export default CartTotals;
