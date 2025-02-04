import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { CartWithCheckoutStep } from '@/types/global';
import { LineItem } from '@medusajs/medusa';
import { getCheckoutStep } from '@lib/util/get-checkout-step';

export const fetchCart = async (cartId?: string) => {
    const cart = await retrieveCart(cartId).then((cart) => cart as CartWithCheckoutStep);

    if (!cart) return null;

    if (cart.items?.length) {
        const enrichedItems = await enrichLineItems(cart.items, cart.region_id);
        cart.items = enrichedItems as LineItem[];
    }

    // Add checkout step only if in checkout flow
    if (cartId) {
        cart.checkout_step = getCheckoutStep(cart);
    }

    return cart;
};
