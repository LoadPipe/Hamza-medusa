import { Metadata } from 'next';
import CartTemplate from '@modules/cart/templates';
import { getHamzaCustomer } from '@lib/data';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';


// Single source of truth
// Supports both: Checkout && Cart
// Optional cartId - if provided, fetch a specific cart; otherwise, it fetches users active cart.

export const metadata: Metadata = {
    title: 'Cart',
    description: 'View your cart',
};

// What: Streaming SSR with Suspense and React Query V5
// 1. Improve perceived performance

export default async function Cart() {
    // SSR So make sure to create a new queryClient instance, so we don't share the same instance between multiple requests
    const queryClient = new QueryClient();

    // Prefetch cart with enrichment & checkout step
    await queryClient.prefetchQuery({
        queryKey: ['cart'],
        queryFn: fetchCartForCart,
        staleTime: 1000 * 60 * 5,
    });

    // Fetch customer details
    const customer = await getHamzaCustomer();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CartTemplate customer={customer} />
        </HydrationBoundary>
    );
}

