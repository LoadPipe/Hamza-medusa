'use client';

import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { convertPrice } from '@/lib/util/price-conversion';
import React, { useEffect } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider, Spinner, VStack } from '@chakra-ui/react';
import { updateShippingCost } from '@lib/server';
import { CartWithCheckoutStep } from '@/types/global';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatHumanReadablePrice } from '@/lib/util/get-product-price';

type CartTotalsProps = {
    cart: CartWithCheckoutStep;
    useCartStyle: boolean;
};

const CartTotals: React.FC<CartTotalsProps> = ({
    useCartStyle,
    cart: initialCart,
}) => {
    const isUpdatingCart = useCartStore((state) => state.isUpdatingCart);
    const { preferred_currency_code } = useCustomerAuthStore((state) => ({
        preferred_currency_code: state.preferred_currency_code,
    }));

    // Use TanStack Query to fetch cart data
    const { data: cart, isLoading: isCartLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: () => {
            const cart = fetchCartForCart();
            return cart;
        },
        staleTime: 0,
        gcTime: 0,
        initialData: initialCart,
    });

    const { data: shippingCostData, isLoading: isShippingCostLoading } =
        useQuery({
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

    let shippingCost = 0;
    let shippingCostCart: CartWithCheckoutStep | null = null;
    if (!isShippingCostLoading && shippingCostData) {
        shippingCost = shippingCostData.cost;
        shippingCostCart = shippingCostData.cart;
        // console.log('shippingCostCart: ', shippingCostCart);
        // console.log('cart: ', cart);
    }

    let cartSubTotal = 0;
    let cartTaxTotal = 0;
    let cartDiscount = 0;
    let cartShippingFee = 0;
    let cartTotal = 0;
    let cartSubTotalHumanReadable: number = 0;
    let cartTaxTotalHumanReadable: number = 0;
    let cartSubTotalConverted: number = 0;
    let cartTaxTotalConverted: number = 0;
    let cartDiscountHumanReadable: number = 0;
    let cartDiscountConverted: number = 0;
    let cartShippingFeeHumanReadable: number = 0;
    let cartShippingFeeConverted: number = 0;
    let cartTotalHumanReadable: number = 0;
    let cartTotalConverted: number = 0;
    let cartTotalEthToUsdConverted: number = 0;

    let cartCurrencyCode = 'usdc';
    let shippingCurrencyCode = 'usdc';
    let preferredCurrencyCode = preferred_currency_code ?? 'usdc';

    if (cart && shippingCostCart) {
        cartCurrencyCode = cart.items[0].currency_code;
        shippingCurrencyCode = shippingCostCart.items[0]?.currency_code;
    }

    if (
        !isShippingCostLoading &&
        !isCartLoading &&
        cart &&
        shippingCostData &&
        preferred_currency_code
    ) {
        cartSubTotal = cart.items.reduce(
            (total, item) => total + item.unit_price * item.quantity,
            0
        );
        cartSubTotalHumanReadable = Number(
            formatCryptoPrice(cartSubTotal, cartCurrencyCode)
        );
        cartTaxTotal = cart.tax_total ?? 0;
        cartTaxTotalHumanReadable = Number(
            formatCryptoPrice(cartTaxTotal, cartCurrencyCode)
        );
        cartDiscount = cart.items.reduce(
            (total, item) => total + (item.discount_total ?? 0),
            0
        );
        cartDiscountHumanReadable = Number(
            formatCryptoPrice(cartDiscount, cartCurrencyCode)
        );
        cartShippingFee = shippingCost;
        cartShippingFeeHumanReadable = Number(
            formatCryptoPrice(cartShippingFee, shippingCurrencyCode)
        );

        cartTotal =
            cartSubTotal - cartDiscount + cartShippingFee + cartTaxTotal;

        cartTotalHumanReadable = Number(
            formatCryptoPrice(cartTotal, cartCurrencyCode)
        );
    }

    const { data: convertedPrice, isLoading: isConvertedPriceLoading } =
        useQuery({
            queryKey: [
                'convertedPrice',
                cartSubTotalHumanReadable,
                cartTaxTotalHumanReadable,
                cartDiscountHumanReadable,
                cartShippingFeeHumanReadable,
            ], // ✅ Unique key per conversion
            queryFn: async () => {
                const cartSubTotal = await convertPrice(
                    Number(cartSubTotalHumanReadable),
                    cartCurrencyCode,
                    preferredCurrencyCode
                );

                const cartTaxTotal = await convertPrice(
                    Number(cartTaxTotalHumanReadable),
                    cartCurrencyCode,
                    preferredCurrencyCode
                );

                const cartDiscount = await convertPrice(
                    Number(cartDiscountHumanReadable),
                    cartCurrencyCode,
                    preferredCurrencyCode
                );

                const cartShippingFee = await convertPrice(
                    Number(cartShippingFeeHumanReadable),
                    shippingCurrencyCode,
                    preferredCurrencyCode
                );

                const cartTotal =
                    cartSubTotal -
                    cartDiscount +
                    cartShippingFee +
                    cartTaxTotal;

                let cartTotalEthToUsd: number = 0;
                if (
                    preferredCurrencyCode === 'eth' &&
                    preferredCurrencyCode === cartCurrencyCode
                ) {
                    cartTotalEthToUsd = await convertPrice(
                        Number(cartTotal),
                        'eth',
                        'usdt'
                    );
                } else {
                    cartTotalEthToUsd = Number(cartTotalHumanReadable);
                }

                return {
                    cartSubTotal: Number(cartSubTotal),
                    cartTaxTotal: Number(cartTaxTotal),
                    cartDiscount: Number(cartDiscount),
                    cartShippingFee: Number(cartShippingFee),
                    cartTotal: Number(cartTotal),
                    cartTotalEthToUsd: Number(cartTotalEthToUsd),
                };
            },
            staleTime: 0, // Cache conversion result for 5 minutes
            gcTime: 0,
        });

    if (!isConvertedPriceLoading) {
        cartSubTotalConverted = convertedPrice?.cartSubTotal ?? 0;
        cartTaxTotalConverted = convertedPrice?.cartTaxTotal ?? 0;
        cartDiscountConverted = convertedPrice?.cartDiscount ?? 0;
        cartShippingFeeConverted = convertedPrice?.cartShippingFee ?? 0;
        cartTotalConverted = convertedPrice?.cartTotal ?? 0;
        cartTotalEthToUsdConverted = convertedPrice?.cartTotalEthToUsd ?? 0;
        // console.log('cartTotalEthToUsdConverted: ', cartTotalEthToUsdConverted);
        // console.log('convertedPrice: ', convertedPrice);
    }

    const convertToBTC = (amount: number) => {
        return amount / 100000000;
    };
    const convertBtcTotal = convertToBTC(cartTotalConverted ?? 0);

    // Effect to handle final load state
    let discountIsCorrectCurrency = false;
    if (preferred_currency_code === cart?.items[0].currency_code) {
        discountIsCorrectCurrency = true;
    }
    useEffect(() => {
        if (
            !isUpdatingCart &&
            !isShippingCostLoading &&
            !isCartLoading &&
            cart
        ) {
            // console.log('Cart totals fully loaded');
            // // You can perform any final actions here
            // console.log('Preferred Currency Code: ', preferred_currency_code);
            // console.log('cart currency code: ', cart.items[0].currency_code);
            // console.log(
            //     'initialCart currency code: ',
            //     initialCart.items[0].currency_code
            // );
        }
    }, [isUpdatingCart, isShippingCostLoading, cart, isCartLoading]);

    if (!cart || cart.items.length === 0) return <p>Empty Cart</p>; // Hide totals if cart is empty

    return (
        // <>
        //     <Text color="white">
        //         Subtotal: {cartSubTotalConverted} (
        //         {cart?.items[0].currency_code})
        //     </Text>
        //     <Text color="white">
        //         Discount: {cartDiscountConverted} (
        //         {cart?.items[0].currency_code})
        //     </Text>
        //     <Text color="white">
        //         Shipping Fee: {cartShippingFeeConverted} (
        //         {shippingCostCart?.items?.[0]?.currency_code})
        //     </Text>
        //     <Text color="white">
        //         Total: {cartTotalConverted} ({cart?.items[0].currency_code})
        //     </Text>
        //     <Text color="white">
        //         Preferred Currency Code: {preferred_currency_code}
        //     </Text>
        // </>
        <>
            {/* amounts */}
            <Flex
                flexDirection={'column'}
                color="white"
                my="2rem"
                gap={{ base: 2, md: 4 }}
            >
                {cart && !isCartLoading && (
                    <Flex justifyContent={'space-between'}>
                        <Text
                            alignSelf={'center'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Subtotal ({cart.items.length} items)
                        </Text>

                        {cartSubTotal === 0 || isUpdatingCart ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                alignSelf="center"
                                className="cart-totals-subtotal"
                            >
                                {formatHumanReadablePrice(
                                    cartSubTotalConverted,
                                    preferredCurrencyCode
                                )}
                            </Text>
                        )}
                    </Flex>
                )}

                {cart && !isCartLoading && cartDiscount > 0 && (
                    <Flex justifyContent={'space-between'}>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            Discount
                        </Text>
                        {isCartLoading ||
                        isShippingCostLoading ||
                        isUpdatingCart ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text fontSize={{ base: '14px', md: '16px' }}>
                                -
                                {formatHumanReadablePrice(
                                    cartDiscountConverted,
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

                {shippingCostData && !isShippingCostLoading ? (
                    <Flex justifyContent={'space-between'}>
                        <Text
                            alignSelf={'center'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Shipping Fee
                        </Text>

                        {cartShippingFee === 0 || isUpdatingCart ? (
                            <Spinner size="sm" color="white" />
                        ) : (
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                alignSelf="center"
                                className="cart-totals-shipping"
                            >
                                {formatHumanReadablePrice(
                                    cartShippingFeeConverted,
                                    preferredCurrencyCode
                                )}
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

            {cart && !isCartLoading && (
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
                    {cartTotal === 0 || isUpdatingCart ? (
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
                                        {formatHumanReadablePrice(
                                            cartTotalConverted,
                                            preferredCurrencyCode
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
                                            {`≅ $${formatHumanReadablePrice(Number(cartTotalEthToUsdConverted), 'usdt')} USD`}
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
