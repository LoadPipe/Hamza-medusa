import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../../services/cart';
import { RouteHandler } from '../../../route-handler';
import StoreShippingSpecService from '../../../../services/store-shipping-spec';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const shippingSpecService: StoreShippingSpecService = req.scope.resolve(
        'storeShippingSpecService'
    );

    const handler = new RouteHandler(req, res, 'GET', '/custom/cart/shipping', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        // Check if cart_id is present
        if (!handler.requireParam('cart_id')) {
            console.error('cart_id parameter missing in request');
            return;
        }

        // Log cart ID being retrieved
        const cartId = handler.inputParams.cart_id;
        const amount =
            await shippingSpecService.calculateShippingPriceForCart(cartId);

        return handler.returnStatus(200, { amount });
    });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'PUT', '/custom/cart/shipping', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        // Check if cart_id is present
        if (!handler.requireParam('cart_id')) {
            console.error('cart_id parameter missing in request');
            return;
        }

        // Log cart ID being retrieved
        const cartId = handler.inputParams.cart_id;

        // Check for cart existence
        const cart = await cartService.retrieve(cartId);
        if (!cart) {
            console.error(`Cart ${cartId} not found`);
            return handler.returnStatusWithMessage(
                404,
                `Cart ${cartId} not found`
            );
        }

        // Check if customer_id exists
        if (!cart.customer_id) {
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
        await cartService.addDefaultShippingMethod(cartId, false);

        return handler.returnStatusWithMessage(
            200,
            'Successfully added shipping method'
        );
    });
};
