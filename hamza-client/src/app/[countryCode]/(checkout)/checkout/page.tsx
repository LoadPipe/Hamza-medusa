import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { LineItem } from '@medusajs/medusa';

import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import Wrapper from '@modules/checkout/components/payment-wrapper';
import CheckoutForm from '@modules/checkout-update-design/templates/checkout-form';
import CheckoutSummary from '@modules/checkout/templates/checkout-summary';
import { Box, Flex } from '@chakra-ui/react';
import CheckoutTemplate from '@modules/checkout-update-design/templates';

export const metadata: Metadata = {
    title: 'Checkout',
};

const sleep = (seconds: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), seconds * 1000);
    });
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

    return (
        <Flex flexDir="row" maxW={'1280px'} width={'100%'}>
            {/* <Wrapper cart={cart}>
                <CheckoutForm cartId={cartId} />
            </Wrapper>

            <CheckoutSummary cartId={cartId} /> */}

            <CheckoutTemplate cart={cart} />
        </Flex>
    );
}
