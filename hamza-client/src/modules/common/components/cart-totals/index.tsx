'use client';
// import { Cart, Order, LineItem } from '@medusajs/medusa';
// import { useCartShippingOptions } from 'medusa-react';
// import { getClientCookie } from '@lib/util/get-client-cookies';
import React, { useState } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider, Spinner } from '@chakra-ui/react';
import Image from 'next/image';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { useQuery } from '@tanstack/react-query';

import { formatCryptoPrice } from '@lib/util/get-product-price';
import { convertPrice } from '@/lib/util/price-conversion';
import { getCartShippingCost, updateShippingCost } from '@lib/server';

import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import { fetchCartForCheckout } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart-for-checkout';
import { CartWithCheckoutStep } from '@/types/global';

type CartTotalsProps = {
    cartId?: string; // Option, cartId for checkout flow...
    useCartStyle: boolean;
};

// type ExtendedLineItem = LineItem & {
//     currency_code?: string;
// };

const CartTotals: React.FC<CartTotalsProps> = ({ useCartStyle, cartId }) => {
    const { preferred_currency_code } = useCustomerAuthStore((state) => ({
        preferred_currency_code: state.preferred_currency_code,
    }));

    /*
        Ok we need a gameplan, pretty sure discount is going based off the big ass value which makes no sense,

        It should be applied to convertedPrice
     */

    // Determine which fetch function to use based on cartId presence
    const { data: cart } = useQuery<CartWithCheckoutStep | null>({
        queryKey: cartId ? ['cart', cartId] : ['cart'],
        queryFn: cartId ? () => fetchCartForCheckout(cartId) : fetchCartForCart,
        staleTime: 1000 * 60 * 5,
        enabled: true, // Always fetch
    });

    const { data: shippingCost, isLoading: loading } = useQuery({
        queryKey: [
            'shippingCost',
            cart?.shipping_address,
            preferred_currency_code,
        ],
        queryFn: () => updateShippingCost(cart!.id), // Only fetch when cart exists
        enabled: !!cart?.id, // Prevents fetching if no cart ID is available
        staleTime: 0,
        gcTime: 0, // Were not caching the shipping
    });
    // alert(shippingCost);

    // function for calculating discount AFTER Item variant price
    // It makes sure the store_id is matching...
    // Is solving this in frontend sub optimal, yes, but the discount its grabbing
    // is odd..I can only access it in the client
    // Lets just create a pseudo code like function first
    // 1. Takes the cart.items array / object
    // 2. Nested for loop, for items go through discountObject,
    // 3. IF store_id matches, check type FIXED || Percentage, do calculate
    // 4. Return discount Amount for it...
    // 5. Test with multiple stores, discount should only apply to store with the discount...
    const [discount, setDiscount] = useState(0);

    function calculateItemDiscount(
        itemVariantPrice: number,
        itemStoreId: string,
        discountObject: any[]
    ): number {
        return discountObject.reduce((totalDiscount, discount) => {
            const ruleType = discount.rule.type;
            const discountValue = discount.rule.value;
            const store = discount.store_id;
            console.log(`RULE IS: ${JSON.stringify(ruleType)}`);
            console.log(`DISCOUNT STORE: ${store}`);
            console.log(`itemVariantPrice: ${itemVariantPrice}`);
            console.log(`RULE VALUE IS: ${discountValue}`);

            if (store === itemStoreId) {
                console.log(`STORE ID MATCHES ${store} == ${itemStoreId}`);
                if (ruleType === 'percentage') {
                    totalDiscount += (itemVariantPrice * discountValue) / 100;
                } else if (ruleType === 'fixed') {
                    // Add fixed discount logic here if needed:
                    totalDiscount += discountValue;
                }
                console.log(`TOTAL DISCOUNT so far: ${totalDiscount}`);
            }
            return totalDiscount;
        }, 0);
    }

    // Refactor: Imperative code to Declarative subset (Functional) code
    const getCartSubtotal = (
        cart: CartWithCheckoutStep | null,
        currencyCode: string
    ) => {
        if (!cart?.items)
            return { currency: currencyCode, amount: 0, discount: 0 };
        console.log(
            `Discount total on item: ${JSON.stringify(cart.discounts)}`
        );

        console.log(
            `Cart items store_id? total on item: ${JSON.stringify(cart.items)}`
        );
        return cart.items.reduce(
            (total, item) => {
                const itemPrice = getPriceByCurrency(
                    item.variant.prices,
                    currencyCode
                );
                const itemStoreId = item.variant.store_id;
                console.log(`Processing item: ${item.id}`);
                console.log(`  Item variant price: ${itemPrice}`);
                console.log(`  Quantity: ${item.quantity}`);
                console.log(`  Discount total on item: ${item.discounts}`);

                let discountVal = calculateItemDiscount(
                    Number(itemPrice),
                    itemStoreId,
                    cart.discounts
                );

                const calculatedItemTotal =
                    Number(itemPrice) * item.quantity - (discountVal ?? 0);
                console.log(`  Calculated item total: ${calculatedItemTotal}`);

                const newSubtotal = total.amount + calculatedItemTotal;
                console.log(`  Running subtotal: ${newSubtotal}`);

                return {
                    currency: currencyCode,
                    amount: newSubtotal,
                    discount: discountVal,
                };
            },
            { currency: currencyCode, amount: 0, discount: 0 }
        );
    };

    const finalSubtotal = getCartSubtotal(
        cart ?? null,
        preferred_currency_code ?? 'usdc'
    );
    const taxTotal = cart?.tax_total ?? 0;
    const grandTotal = (finalSubtotal.amount ?? 0) + shippingCost + taxTotal;
    const displayCurrency =
        finalSubtotal?.currency || preferred_currency_code || 'usdc';

    console.log(`finalSubtotal.discount ${finalSubtotal.discount}`);
    const { data: convertedPrice, isLoading: isConverting } = useQuery({
        queryKey: ['convertedPrice', grandTotal, preferred_currency_code], // ✅ Unique key per conversion
        queryFn: async () => {
            const result = await convertPrice(
                Number(
                    formatCryptoPrice(
                        grandTotal,
                        preferred_currency_code ?? 'usdc'
                    )
                ),
                'eth',
                'usdc'
            );
            return Number(result).toFixed(2);
        },
        enabled: preferred_currency_code === 'eth', //  Fetch only when preferred currency is ETH
        staleTime: 1000 * 60 * 5, // Cache conversion result for 5 minutes
    });

    if (!cart || cart.items.length === 0) return <p>Empty Cart</p>; // Hide totals if cart is empty

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
                            className="cart-totals-subtotal"
                        >
                            {formatCryptoPrice(
                                finalSubtotal.amount,
                                displayCurrency
                            )}
                        </Text>
                    </Flex>
                )}

                {finalSubtotal.discount > 0 && (
                    <Flex justifyContent={'space-between'}>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            Discount
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            -
                            {formatCryptoPrice(
                                finalSubtotal.discount,
                                displayCurrency
                            )}
                        </Text>
                    </Flex>
                )}

                {!!cart.gift_card_total && (
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

                        {loading ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                alignSelf="center"
                                className="cart-totals-shipping"
                            >
                                {formatCryptoPrice(
                                    shippingCost!,
                                    displayCurrency
                                ).toString()}
                            </Text>
                        )}
                    </Flex>
                ) : (
                    <Flex mt="-1rem" justifyContent={'space-between'}></Flex>
                )}
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
                    {loading ? (
                        <Spinner size="sm" color="white" />
                    ) : (
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
                                    className="cart-totals-total"
                                >
                                    {formatCryptoPrice(
                                        grandTotal,
                                        displayCurrency
                                    )}
                                </Text>
                            </Flex>
                            {preferred_currency_code === 'eth' && (
                                <Flex justifyContent="flex-end" width="100%">
                                    <Text
                                        as="h3"
                                        variant="semibold"
                                        color="white"
                                        mt={2}
                                        fontSize={{
                                            base: '15px',
                                            md: '18px',
                                        }}
                                        fontWeight={700}
                                        textAlign="right"
                                    >
                                        {`≅ $${convertedPrice} USD`}
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                    )}
                </Flex>
            )}
        </>
    );
};

export default CartTotals;
