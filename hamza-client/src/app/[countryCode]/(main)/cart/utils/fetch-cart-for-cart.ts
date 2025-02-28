import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem, Cart } from '@medusajs/medusa';
import { CartWithCheckoutStep } from '@/types/global';
import { getCheckoutStep } from '@lib/util/get-checkout-step';

export const fetchCartForCart = async (): Promise<CartWithCheckoutStep | null> => {
    const cart = await retrieveCart().then(
        (cart) => cart as CartWithCheckoutStep
    );

    if (!cart) {
        return null;
    }

    if (cart?.items?.length) {
        const enrichedItems = await enrichLineItems(cart.items, cart.region_id);
        cart.items = enrichedItems as LineItem[];
    }

    // ✅ Ensure `checkout_step` is always assigned
    cart.checkout_step = getCheckoutStep(cart) || 'shipping';

    return cart;
};
