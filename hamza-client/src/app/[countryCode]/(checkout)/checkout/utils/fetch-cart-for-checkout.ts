import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { CartWithCheckoutStep } from '@/types/global';
import { LineItem } from '@medusajs/medusa';
import { addDefaultShippingMethod, setBestShippingAddress } from '@/lib/server';

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
    let cart = await retrieveCart(cartId);

    // enrich line items
    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    // handle shipping address
    if (!cart?.shipping_address_id) {
        const address = await setBestShippingAddress(cart);
        if (address) {
            cart = await retrieveCart(cartId);
        }
    }

    // add default shipping method
    if (!cart?.shipping_methods || !cart?.shipping_methods.length) {
        const shippingMethod = await addDefaultShippingMethod(cart);
        if (shippingMethod) {
            cart = await retrieveCart(cartId);
        }
    }

    return cart;
};
