import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { CartWithCheckoutStep } from '@/types/global';
import { LineItem } from '@medusajs/medusa';
import { getCheckoutStep } from '@lib/util/get-checkout-step';

export const fetchCart = async () => {
    const cart = await retrieveCart().then(
        (cart) => cart as CartWithCheckoutStep
    );
    if (!cart) {
        return null;
    }
    if (cart?.items?.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }
    cart.checkout_step = cart && getCheckoutStep(cart);
    return cart;
};