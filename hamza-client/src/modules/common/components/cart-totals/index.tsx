'use client';

import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { convertPrice } from '@/lib/util/price-conversion';
import React, { useMemo } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider, Spinner, VStack } from '@chakra-ui/react';
import { updateShippingCost } from '@lib/server';
import { CartWithCheckoutStep } from '@/types/global';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatHumanReadablePrice } from '@/lib/util/get-product-price';
import { currencyIsUsdStable } from '@/lib/util/currencies';

type CartTotalsProps = {
    cart: CartWithCheckoutStep;
    useCartStyle: boolean;
};

interface CartCalculations {
    subtotal: number;
    taxTotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    cartCurrencyCode: string;
    shippingCurrencyCode: string;
    preferredCurrencyCode: string;
    humanReadable: {
        subtotal: string | number;
        taxTotal: string | number;
        discount: string | number;
        shippingFee: string | number;
        total: string | number;
    };
    converted: {
        subtotal: number;
        taxTotal: number;
        discount: number;
        shippingFee: number;
        total: number;
        toUsd: number;
    };
}

const CartTotals: React.FC<CartTotalsProps> = ({
    useCartStyle,
    cart: initialCart,
}) => {
    const isUpdatingCart = useCartStore((state) => state.isUpdatingCart);
    const { preferred_currency_code } = useCustomerAuthStore((state) => ({
        preferred_currency_code: state.preferred_currency_code,
    }));

    // Fetch cart data
    const { data: cart, isLoading: isCartLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCartForCart,
        staleTime: 0,
        gcTime: 0,
        initialData: initialCart,
    });

    // Fetch shipping cost
    const { data: shippingCostData, isLoading: isShippingCostLoading } =
        useQuery({
            queryKey: [
                'shippingCost',
                cart?.shipping_address,
                preferred_currency_code,
            ],
            queryFn: async () => {
                const result = await updateShippingCost(cart!.id);
                if (typeof result === 'number') {
                    return { cost: result, cart: cart! };
                }
                return result;
            },
            enabled: !!cart?.id,
            staleTime: 0,
            gcTime: 0,
        });

    // Helper function to safely convert formatted prices to numbers for calculations
    const parseFormattedPrice = (value: string | number): number => {
        if (typeof value === 'number') return value;
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    // Calculate cart totals
    const cartCalculations = useMemo<CartCalculations>(() => {
        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0 ||
            !shippingCostData ||
            !shippingCostData.cart ||
            shippingCostData.cart.items.length === 0 ||
            isCartLoading ||
            isShippingCostLoading
        ) {
            return {
                subtotal: 0,
                taxTotal: 0,
                discount: 0,
                shippingFee: 0,
                total: 0,
                cartCurrencyCode: 'usdc',
                shippingCurrencyCode: 'usdc',
                preferredCurrencyCode: 'usdc',
                humanReadable: {
                    subtotal: 0,
                    taxTotal: 0,
                    discount: 0,
                    shippingFee: 0,
                    total: 0,
                },
                converted: {
                    subtotal: 0,
                    taxTotal: 0,
                    discount: 0,
                    shippingFee: 0,
                    total: 0,
                    toUsd: 0,
                },
            };
        }

        const cartCurrencyCode = cart.items[0]?.currency_code ?? 'usdc';
        const shippingCurrencyCode =
            shippingCostData.cart.items[0]?.currency_code ?? 'usdc';
        const preferredCurrencyCode = preferred_currency_code ?? 'usdc';

        const subtotal = cart.items.reduce(
            (total, item) => total + item.unit_price * item.quantity,
            0
        );
        const taxTotal = cart.tax_total ?? 0;
        const discount = cart.items.reduce(
            (total, item) => total + (item.discount_total ?? 0),
            0
        );
        const shippingFee = shippingCostData.cost;
        const total = subtotal - discount + shippingFee + taxTotal;

        return {
            subtotal,
            taxTotal,
            discount,
            shippingFee,
            total,
            cartCurrencyCode,
            shippingCurrencyCode,
            preferredCurrencyCode,
            humanReadable: {
                subtotal: formatCryptoPrice(subtotal, cartCurrencyCode),
                taxTotal: formatCryptoPrice(taxTotal, cartCurrencyCode),
                discount: formatCryptoPrice(discount, cartCurrencyCode),
                shippingFee: formatCryptoPrice(
                    shippingFee,
                    shippingCurrencyCode
                ),
                total: formatCryptoPrice(total, cartCurrencyCode),
            },
            converted: {
                subtotal: 0,
                taxTotal: 0,
                discount: 0,
                shippingFee: 0,
                total: 0,
                toUsd: 0,
            },
        };
    }, [
        cart,
        shippingCostData,
        isCartLoading,
        isShippingCostLoading,
        preferred_currency_code,
    ]);

    // Convert prices to preferred currency
    const { data: convertedPrices, isLoading: isConvertedPriceLoading } =
        useQuery({
            queryKey: [
                'convertedPrice',
                cartCalculations.humanReadable,
                cartCalculations.cartCurrencyCode,
                cartCalculations.shippingCurrencyCode,
                cartCalculations.preferredCurrencyCode,
            ],
            queryFn: async () => {
                const [subtotal, taxTotal, discount, shippingFee] =
                    await Promise.all([
                        convertPrice(
                            parseFormattedPrice(
                                cartCalculations.humanReadable.subtotal
                            ),
                            cartCalculations.cartCurrencyCode,
                            preferredCurrencyCode
                        ),
                        convertPrice(
                            parseFormattedPrice(
                                cartCalculations.humanReadable.taxTotal
                            ),
                            cartCalculations.cartCurrencyCode,
                            preferredCurrencyCode
                        ),
                        convertPrice(
                            parseFormattedPrice(
                                cartCalculations.humanReadable.discount
                            ),
                            cartCalculations.cartCurrencyCode,
                            preferredCurrencyCode
                        ),
                        convertPrice(
                            parseFormattedPrice(
                                cartCalculations.humanReadable.shippingFee
                            ),
                            cartCalculations.shippingCurrencyCode,
                            preferredCurrencyCode
                        ),
                    ]);

                const total = subtotal - discount + shippingFee + taxTotal;
                let toUsd = parseFormattedPrice(
                    cartCalculations.humanReadable.total
                );

                if (
                    !currencyIsUsdStable(preferredCurrencyCode) &&
                    preferredCurrencyCode === cartCalculations.cartCurrencyCode
                ) {
                    toUsd = await convertPrice(
                        total,
                        preferredCurrencyCode,
                        'usdt'
                    );
                }

                return {
                    subtotal: Number(subtotal),
                    taxTotal: Number(taxTotal),
                    discount: Number(discount),
                    shippingFee: Number(shippingFee),
                    total: Number(total),
                    toUsd: Number(toUsd),
                };
            },
            enabled: !!parseFormattedPrice(
                cartCalculations.humanReadable.subtotal
            ),
            staleTime: 0,
            gcTime: 0,
        });

    // Update converted prices when available
    const finalCalculations = useMemo(() => {
        if (!convertedPrices || isConvertedPriceLoading) {
            return cartCalculations;
        }

        return {
            ...cartCalculations,
            converted: {
                ...cartCalculations.converted,
                ...convertedPrices,
            },
        };
    }, [cartCalculations, convertedPrices, isConvertedPriceLoading]);

    const { data: convertBtcTotal } = useQuery({
        queryKey: [
            'convertBtcTotal',
            cartCalculations.total,
            cartCalculations.cartCurrencyCode,
        ], // ✅ Unique key per conversion
        queryFn: async () => {
            const result = await convertPrice(
                parseFormattedPrice(
                    formatCryptoPrice(
                        cartCalculations.total,
                        cartCalculations.cartCurrencyCode
                    )
                ),
                cartCalculations.cartCurrencyCode,
                'btc'
            );
            return Number(result).toFixed(8);
        },
        enabled: process.env.NEXT_PUBLIC_PAY_WITH_BITCOIN === 'true',
        staleTime: 0,
        gcTime: 0,
    });

    if (!cart || cart.items.length === 0) {
        return <p>Empty Cart</p>;
    }

    const isLoading =
        isCartLoading ||
        isShippingCostLoading ||
        isConvertedPriceLoading ||
        isUpdatingCart ||
        isNaN(finalCalculations.converted.toUsd);
    const preferredCurrencyCode = preferred_currency_code ?? 'usdc';

    return (
        <>
            <Flex
                flexDirection={'column'}
                color="white"
                my="2rem"
                gap={{ base: 2, md: 4 }}
            >
                {!isCartLoading && (
                    <Flex justifyContent={'space-between'}>
                        <Text
                            alignSelf={'center'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Subtotal ({cart.items.length} items)
                        </Text>
                        {isLoading ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                alignSelf="center"
                                className="cart-totals-subtotal"
                            >
                                {preferredCurrencyCode ===
                                cartCalculations.cartCurrencyCode
                                    ? finalCalculations.humanReadable.subtotal
                                    : formatHumanReadablePrice(
                                          finalCalculations.converted.subtotal,
                                          preferredCurrencyCode
                                      )}
                            </Text>
                        )}
                    </Flex>
                )}

                {!isCartLoading && finalCalculations.discount > 0 && (
                    <Flex justifyContent={'space-between'}>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            Discount
                        </Text>
                        {isLoading ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text fontSize={{ base: '14px', md: '16px' }}>
                                -
                                {preferredCurrencyCode ===
                                cartCalculations.cartCurrencyCode
                                    ? finalCalculations.humanReadable.discount
                                    : formatHumanReadablePrice(
                                          finalCalculations.converted.discount,
                                          preferredCurrencyCode
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

                {shippingCostData && !isShippingCostLoading && (
                    <Flex justifyContent={'space-between'}>
                        <Text
                            alignSelf={'center'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Shipping Fee
                        </Text>
                        {isLoading ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                alignSelf="center"
                                className="cart-totals-shipping"
                            >
                                {preferredCurrencyCode ===
                                cartCalculations.shippingCurrencyCode
                                    ? finalCalculations.humanReadable
                                          .shippingFee
                                    : formatHumanReadablePrice(
                                          finalCalculations.converted
                                              .shippingFee,
                                          preferredCurrencyCode
                                      )}
                            </Text>
                        )}
                    </Flex>
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

            {!isCartLoading && (
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
                    {isLoading ? (
                        <Spinner size="sm" color="white" />
                    ) : (
                        <VStack alignItems="flex-end">
                            <Flex flexDirection="column" alignItems="flex-end">
                                <Flex flexDirection={'row'} alignItems="center">
                                    <Flex alignItems={'center'}>
                                        <Image
                                            className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                                            src={
                                                currencyIcons[
                                                    preferredCurrencyCode
                                                ]
                                            }
                                            alt={preferredCurrencyCode}
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
                                        {preferredCurrencyCode ===
                                        cartCalculations.cartCurrencyCode
                                            ? finalCalculations.humanReadable
                                                  .total
                                            : formatHumanReadablePrice(
                                                  finalCalculations.converted
                                                      .total,
                                                  preferredCurrencyCode
                                              )}
                                    </Text>
                                </Flex>
                                {!currencyIsUsdStable(
                                    preferred_currency_code
                                ) && (
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
                                            {`≅ $${formatHumanReadablePrice(finalCalculations.converted.toUsd, 'usdt')} USD`}
                                        </Text>
                                    </Flex>
                                )}
                                {process.env.NEXT_PUBLIC_PAY_WITH_BITCOIN ===
                                    'true' &&
                                    preferredCurrencyCode != 'btc' && (
                                        <Flex>
                                            <Text>≅ {convertBtcTotal} BTC</Text>
                                        </Flex>
                                    )}
                            </Flex>
                        </VStack>
                    )}
                </Flex>
            )}
        </>
    );
};

export default CartTotals;
