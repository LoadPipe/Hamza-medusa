import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../../services/cart';
import { RouteHandler } from '../../../route-handler';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'PUT', '/custom/cart/shipping', [
        'cart_id',
    ]);

    console.log(
        'Handler initialized with cart_id:',
        handler.inputParams.cart_id
    );

    await handler.handle(async () => {
        // Check if cart_id is present
        if (!handler.requireParam('cart_id')) {
            console.error('cart_id parameter missing in request');
            return;
        }

        // Log cart ID being retrieved
        const cartId = handler.inputParams.cart_id;
        console.log('Retrieving cart with cartId:', cartId);

        // Check for cart existence
        const cart = await cartService.retrieve(cartId);
        if (!cart) {
            console.error(`Cart ${cartId} not found`);
            return handler.returnStatusWithMessage(
                404,
                `Cart ${cartId} not found`
            );
        }

        // Log retrieved cart details
        console.log('Cart retrieved:', cart);

        // Check if customer_id exists
        if (!cart.customer_id) {
            console.error('Cart has no customer_id:', cart);
            return handler.returnStatusWithMessage(
                400,
                'Customer ID missing from cart'
            );
        }

        console.log('Enforcing customer ID:', cart.customer_id);
        // Enforce customer ID security
        if (!handler.enforceCustomerId(cart.customer_id)) {
            console.error('Customer ID enforcement failed');
            return;
        }

        // Add default shipping method and log the result
        await cartService.addDefaultShippingMethod(cartId, true);

        return handler.returnStatusWithMessage(
            200,
            'Successfully added shipping method'
        );
    });
};
