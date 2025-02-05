'use client'; // ✅ Mark as a Client Component

import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { enrichLineItems } from '@modules/cart/actions';
import { Cart, LineItem } from '@medusajs/medusa';
import CartTotals from '@modules/common/components/cart-totals';
import PaymentButton from '@modules/checkout/components/payment-button';
import DiscountCode from '@modules/checkout/components/discount-code';
import { useQuery } from '@tanstack/react-query';
import { fetchCartForCheckout } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart-for-checkout';
import Spinner from '@modules/common/icons/spinner';

const PaymentSummary = ({ cartId }: { cartId: string }) => {
    // Fetch the cart
    const { data: cart, isLoading: cartLoading, isError: cartError } = useQuery({
        queryKey: ['cart', cartId], // Include cartId to refetch when it changes
        queryFn: async () => fetchCartForCheckout(cartId), // ✅ Call the function properly
        staleTime: 1000 * 60 * 5, // Cache cart for 5 minutes
    });

    // Fetch enriched line items
    const { data: enrichedCart, isLoading: enrichLoading, isError: enrichError } = useQuery({
        queryKey: ['enrichedCart', cart?.id],
        queryFn: async () => {
            if (!cart || !cart.items.length) return cart;
            const enrichedItems = await enrichLineItems(cart.items, cart.region_id);
            return { ...cart, items: enrichedItems as LineItem[] } as Omit<Cart, 'refundable_amount' | 'refunded_total'>;
        },
        enabled: !!cart?.id,
    });


    if (cartLoading || enrichLoading) return <Spinner size={36} />;
    if (cartError || enrichError || !cart) {
        console.log('Cart not found or error occurred');
        return <Text>Error loading cart</Text>;
    }


    return (
        <Flex
            bgColor={'#121212'}
            color={'white'}
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            minHeight={{ base: 'auto', md: '400px' }}
            maxHeight={{ base: 'auto', md: '580px' }}
            flexDir={'column'}
            borderRadius={'16px'}
            p={{ base: '16px', md: '40px' }}
        >
            <Text color={'primary.green.900'} fontSize={'18px'} fontWeight={600}>
                Payment Summary
            </Text>

            <CartTotals useCartStyle={true} />

            <Flex mt="auto" flexDir={'column'} gap={5}>
                <DiscountCode />
                {enrichedCart ? <PaymentButton cart={enrichedCart} /> : <Text>Loading cart...</Text>}
            </Flex>
        </Flex>
    );
};

export default PaymentSummary;
