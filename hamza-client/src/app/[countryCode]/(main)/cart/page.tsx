import { Metadata } from 'next';
import CartTemplate from '@/modules/cart/templates/cart-template';
import { getHamzaCustomer } from '@/lib/server';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import EmptyCart from '@/modules/cart/components/empty-cart';

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
    // Fetch customer details
    const customer = await getHamzaCustomer();
    const cart = await fetchCartForCart();

    if (!cart) {
        return <EmptyCart />;
    }

    return <CartTemplate customer={customer} _cart={cart} />;
}
