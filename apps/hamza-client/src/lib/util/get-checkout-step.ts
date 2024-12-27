import { Cart } from '@medusajs/medusa';

export function getCheckoutStep(
    cart: Omit<Cart, 'beforeInsert' | 'beforeUpdate' | 'afterUpdateOrLoad'>
) {
    // If no shipping address or email, go to 'address'
    if (!cart?.shipping_address?.address_1 || !cart.email) {
        return 'address';
    }

    // If both shipping address and email exist, go to 'review'
    return 'review';
}
