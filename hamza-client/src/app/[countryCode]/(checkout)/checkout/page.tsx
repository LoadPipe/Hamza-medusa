import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import ForceWalletConnect from '@/app/components/loaders/force-wallet-connect';
import CheckoutTemplate from '@/modules/checkout/templates';
import { fetchCart } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Proceed to checkout securely',
};

export default async function Checkout(params: any) {
    const queryClient = new QueryClient();

    let cartId = cookies().get('_medusa_cart_id')?.value;
    if (!cartId && params?.searchParams?.cart) cartId = params.searchParams.cart;

    if (!cartId) {
        console.log('Cart ID not found');
        return notFound();
    }

    // Prefetch and hydrate the cart
    await queryClient.prefetchQuery({
        queryKey: ['cart', cartId],
        queryFn: () => fetchCart(cartId),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Flex flexDir="row" maxW="1280px" width="100%">
                {!cartId ? <ForceWalletConnect /> : <CheckoutTemplate cartId={cartId} />}
            </Flex>
        </HydrationBoundary>
    );
}
