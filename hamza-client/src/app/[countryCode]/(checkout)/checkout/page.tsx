import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import CheckoutTemplate from '@/modules/checkout/templates';
import { RainbowWrapper } from '@/app/components/providers/rainbowkit/rainbow-provider';
import EmptyCart from '@/modules/cart/components/empty-cart';
import { getHamzaCustomer } from '@/lib/server';
import { fetchCartForCart } from '../../(main)/cart/utils/fetch-cart-for-cart';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Proceed to checkout securely',
};

export default async function Checkout(params: any) {
    let cartId = cookies().get('_medusa_cart_id')?.value;
    if (!cartId && params?.searchParams?.cart)
        cartId = params.searchParams.cart;

    if (!cartId) {
        console.log('Cart ID not found');
        return notFound();
    }

    const cart = await fetchCartForCart();

    // get customer if logged in
    const customer = await getHamzaCustomer();

    if (!cart) {
        return <EmptyCart />;
    }

    return (
        <RainbowWrapper>
            <Flex flexDir="row" maxW="1280px" width="95vw">
                {<CheckoutTemplate cart={cart} customer={customer} />}
            </Flex>
        </RainbowWrapper>
    );
}
