import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import CheckoutTemplate from '@/modules/checkout/templates';
import { fetchCartForCheckout } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart-for-checkout';
import getQueryClient from '@/app/query-utils/getQueryClient';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Proceed to checkout securely',
};

export default async function Checkout(params: any) {
    // SSR So make sure to create a new queryClient instance, so we don't share the same instance between multiple requests
    const queryClient = getQueryClient();

    let cartId = cookies().get('_medusa_cart_id')?.value;
    if (!cartId && params?.searchParams?.cart)
        cartId = params.searchParams.cart;

    if (!cartId) {
        console.log('Cart ID not found');
        return notFound();
    }

    // Prefetch and hydrate the cart
    await queryClient.prefetchQuery({
        queryKey: ['cart', cartId],
        queryFn: () => fetchCartForCheckout(cartId),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Flex flexDir="row" maxW="1280px" width="100%">
                {<CheckoutTemplate cartId={cartId} />}
            </Flex>
        </HydrationBoundary>
    );
}
