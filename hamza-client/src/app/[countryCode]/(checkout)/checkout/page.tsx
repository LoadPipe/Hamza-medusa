/**
 * Author: Garo Nazarian
 * Refactored by: Doom
 * We're going to use Tanstack Query here with Hydration and Suspense
 * We're going to use a similar architecture as in the Order Page where we have done this...
 *
 * 1. Allow automatic background refetching if data becomes stale
 * 2. Improve performance and UX by reducing unnecessary re-fetches.
 * 3. Ensure QueryClient handles the state properly across client & server
 *
 */

import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { LineItem } from '@medusajs/medusa';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { Flex } from '@chakra-ui/react';
import ForceWalletConnect from '@/app/components/loaders/force-wallet-connect';
import CheckoutTemplate from '@/modules/checkout/templates';
import { SwitchNetwork } from '@/app/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { dehydrate } from '@tanstack/react-query';

export const metadata: Metadata = {
    title: 'Checkout',
};

const fetchCart = async (cartId: string) => {
    const cart = await retrieveCart(cartId);

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return cart;
};

export default async function Checkout(params: any) {
    let cartId = cookies().get('_medusa_cart_id')?.value;
    if (!cartId && params?.searchParams?.cart)
        cartId = params.searchParams.cart;

    if (!cartId) {
        console.log('cart id not found');
        return notFound();
    }

    const cart = await fetchCart(cartId);

    if (!cart) {
        console.log('cart data not found');
        return notFound();
    }

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return (
        <Flex flexDir="row" maxW={'1280px'} width={'100%'}>
            {!cart.customer_id ? (
                <ForceWalletConnect />
            ) : (
                <CheckoutTemplate cart={cart} cartId={cartId} />
            )}
        </Flex>
    );
}
