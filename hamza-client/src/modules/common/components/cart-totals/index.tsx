'use client';

import Image from 'next/image';
import { LineItem } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { convertPrice } from '@/lib/util/price-conversion';
import React from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider, Spinner, VStack } from '@chakra-ui/react';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { updateShippingCost } from '@lib/server';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import { fetchCartForCheckout } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart-for-checkout';
import { CartWithCheckoutStep } from '@/types/global';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/zustand/cart-store/cart-store';

type CartTotalsProps = {
    cartId?: string; // Option, cartId for checkout flow...
    useCartStyle: boolean;
};

const CartTotals: React.FC<CartTotalsProps> = ({ useCartStyle, cartId }) => {
    const isUpdatingCart = useCartStore((state) => state.isUpdatingCart);
    const { preferred_currency_code } = useCustomerAuthStore((state) => ({
        preferred_currency_code: state.preferred_currency_code,
    }));

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

    // Refactor: Imperative code to Declarative subset (Functional) code
    const getCartSubtotal = (
        cart: CartWithCheckoutStep | null,
        currencyCode: string,
        options?: { includeDiscounts?: boolean }
    ) => {
        if (!cart?.items) return { currency: currencyCode, amount: 0 };

        return cart.items.reduce(
            (total, item) => {
                const applyDiscounts = options?.includeDiscounts ?? true;

                const itemPrice = getPriceByCurrency(
                    item.variant.prices,
                    currencyCode
                );

                const discount = applyDiscounts
                    ? (item.discount_total ?? 0)
                    : 0;
                const baseAmount = Number(itemPrice) * item.quantity;

                return {
                    currency: currencyCode,
                    amount: total.amount + (baseAmount - (discount ?? 0)),
                };
            },
            { currency: currencyCode, amount: 0 }
        );
    };

    const convertToBTC = (amount: number) => {
        return amount / 100000000;
    };

    const finalSubtotal = getCartSubtotal(
        cart ?? null,
        preferred_currency_code ?? 'usdc',
        { includeDiscounts: false }
    );
    const finalTotal = getCartSubtotal(
        cart ?? null,
        preferred_currency_code ?? 'usdc',
        { includeDiscounts: true }
    );
    const convertBtcTotal = convertToBTC(finalTotal.amount ?? 0);

    const taxTotal = cart?.tax_total ?? 0;
    const grandTotal = (finalTotal.amount ?? 0) + shippingCost + taxTotal;
    const displayCurrency =
        finalSubtotal?.currency || preferred_currency_code || 'usdc';

    const { data: convertedPrice } = useQuery({
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
                            Subtotal ({cart.items.length} items)
                        </Text>

                        {loading || isUpdatingCart ? (
                            <Spinner size="sm" color="white" />
                        ) : (
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
                        )}
                    </Flex>
                )}

                {!!cart.discount_total && (
                    <Flex justifyContent={'space-between'}>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            Discount
                        </Text>
                        {loading || isUpdatingCart ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text fontSize={{ base: '14px', md: '16px' }}>
                                -
                                {formatCryptoPrice(
                                    cart.discount_total,
                                    displayCurrency
                                )}
                            </Text>
                        )}
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
                            Shipping Fee
                        </Text>

                        {loading || isUpdatingCart ? (
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
                    {loading || isUpdatingCart ? (
                        <Spinner size="sm" color="white" />
                    ) : (
                        <VStack alignItems="flex-end">
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
                                    <Flex
                                        justifyContent="flex-end"
                                        width="100%"
                                    >
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
                            {process.env.NEXT_PUBLIC_PAY_WITH_BITCOIN ===
                                'true' && (
                                <Flex>
                                    <Text>≅ {convertBtcTotal} BTC</Text>
                                </Flex>
                            )}
                        </VStack>
                    )}
                </Flex>
            )}
        </>
    );
};

export default CartTotals;
