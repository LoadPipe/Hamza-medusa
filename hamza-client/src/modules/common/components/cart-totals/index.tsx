'use client';

import Image from 'next/image';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { convertPrice } from '@/lib/util/price-conversion';
import React, { useEffect } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { Flex, Text, Divider, Spinner, VStack } from '@chakra-ui/react';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { updateShippingCost } from '@lib/server';
import { getPriceByCurrency } from '@/lib/util/get-price-by-currency';
import { CartWithCheckoutStep } from '@/types/global';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';

type CartTotalsProps = {
    cart: CartWithCheckoutStep;
    useCartStyle: boolean;
};

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

            const discount = applyDiscounts ? (item.discount_total ?? 0) : 0;
            const baseAmount = Number(itemPrice) * item.quantity;

            return {
                currency: currencyCode,
                amount: total.amount + (baseAmount - (discount ?? 0)),
            };
        },
        { currency: currencyCode, amount: 0 }
    );
};

const CartTotals: React.FC<CartTotalsProps> = ({
    useCartStyle,
    cart: initialCart,
}) => {
    const isUpdatingCart = useCartStore((state) => state.isUpdatingCart);
    const setIsUpdatingCart = useCartStore((state) => state.setIsUpdatingCart);
    const { preferred_currency_code } = useCustomerAuthStore((state) => ({
        preferred_currency_code: state.preferred_currency_code,
    }));

    // Use TanStack Query to fetch cart data
    const { data: cart, isLoading: isCartLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: () => {
            setIsUpdatingCart(true);
            const cart = fetchCartForCart();
            setIsUpdatingCart(false);
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
        console.log('cart: ', cart);
    }

    let cartSubTotal = 0;
    let cartDiscount = 0;
    let cartShippingFee = 0;
    let cartTotal = 0;
    if (
        !isShippingCostLoading &&
        !isCartLoading &&
        cart &&
        shippingCostData &&
        preferred_currency_code
    ) {
        cartSubTotal = cart.subtotal ?? 0;
        cartDiscount = cart.discount_total ?? 0;
        cartShippingFee = shippingCost;
        cartTotal = cart.total ?? 0;
    }

    // const convertToBTC = (amount: number) => {
    //     return amount / 100000000;
    // };

    // const finalSubtotal = getCartSubtotal(
    //     cart ?? null,
    //     preferred_currency_code ?? 'usdc',
    //     { includeDiscounts: false }
    // );
    // const finalTotal = getCartSubtotal(
    //     cart ?? null,
    //     preferred_currency_code ?? 'usdc',
    //     { includeDiscounts: true }
    // );
    // const convertBtcTotal = convertToBTC(finalTotal.amount ?? 0);

    // const taxTotal = cart?.tax_total ?? 0;
    // const grandTotal = (finalTotal.amount ?? 0) + shippingCost + taxTotal;
    // const displayCurrency =
    //     finalSubtotal?.currency || preferred_currency_code || 'usdc';

    // const { data: convertedPrice } = useQuery({
    //     queryKey: ['convertedPrice', grandTotal, preferred_currency_code], // ✅ Unique key per conversion
    //     queryFn: async () => {
    //         const result = await convertPrice(
    //             Number(
    //                 formatCryptoPrice(
    //                     grandTotal,
    //                     preferred_currency_code ?? 'usdc'
    //                 )
    //             ),
    //             'eth',
    //             'usdc'
    //         );
    //         return Number(result).toFixed(2);
    //     },
    //     enabled: preferred_currency_code === 'eth', //  Fetch only when preferred currency is ETH
    //     staleTime: 1000 * 60 * 5, // Cache conversion result for 5 minutes
    // });

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
        <>
            <Text>
                Subtotal: {cartSubTotal} ({cart?.items[0].currency_code})
            </Text>
            <Text>
                Discount: {cartDiscount} ({cart?.items[0].currency_code})
            </Text>
            <Text>
                Shipping Fee: {cartShippingFee} (
                {shippingCostCart?.items?.[0]?.currency_code})
            </Text>
            <Text>
                Total: {cartTotal} ({cart?.items[0].currency_code})
            </Text>
        </>
    );
};

export default CartTotals;
