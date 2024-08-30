import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../../services/cart';
import { RouteHandler } from '../../../route-handler';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'PUT', '/custom/cart/shipping', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParam('cart_id'))
            return;

        //check for cart existence
        const cartId = handler.inputParams.cart_id;
        const cart = await cartService.retrieve(cartId);
        if (!cart) {
            return res.status(404).json({ message: `Cart ${cartId} not found` })
        }

        //enforce security
        if (!handler.enforceCustomerId(cart.customer_id))
            return;

        await cartService.addDefaultShippingMethod(cartId);
        return res.send({ status: true });
    });
};
