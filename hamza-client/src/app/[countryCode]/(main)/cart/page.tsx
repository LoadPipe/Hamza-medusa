import { LineItem } from '@medusajs/medusa';
import { Metadata } from 'next';

import CartTemplate from '@modules/cart/templates';

import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { getCheckoutStep } from '@lib/util/get-checkout-step';
import { CartWithCheckoutStep } from '@/types/global';
import { getHamzaCustomer, getCartTwo } from '@lib/data';
import Loading from './loading';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
    title: 'Cart',
    description: 'View your cart',
};

const fetchCart = async () => {
    let cartId = cookies().get('_medusa_cart_id')?.value;

    await getCartTwo(cartId as string);

    const cart = await retrieveCart().then(
        (cart) => cart as CartWithCheckoutStep
    );

    if (!cart) {
        return null;
    }

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    cart.checkout_step = cart && getCheckoutStep(cart);

    return cart;
};

export default async function Cart() {
    const cart = await fetchCart();
    console.log(`$$$$ CART ${JSON.stringify(cart)}`);
    const customer = await getHamzaCustomer();

    return <CartTemplate cart={cart} customer={customer} />;
}
