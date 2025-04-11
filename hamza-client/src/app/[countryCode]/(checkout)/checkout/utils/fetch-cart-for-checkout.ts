import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { CartWithCheckoutStep } from '@/types/global';
import { LineItem, Store } from '@medusajs/medusa';
import { getCheckoutStep } from '@lib/util/get-checkout-step';

/**
 * Fetches the cart and enriches the line items with product data
 *
 * @param {string} cartId The cart id
 * @returns {Promise<CartWithCheckoutStep>} The cart
 * In cart flow we will acquire the cart_id => pass it to the checkout flow... we should pass this as prop since
 * it's a ssc cookie...
 */
export const fetchCartForCheckout = async (
    cartId: string
): Promise<CartWithCheckoutStep | null> => {
    if (!cartId) return null;
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
