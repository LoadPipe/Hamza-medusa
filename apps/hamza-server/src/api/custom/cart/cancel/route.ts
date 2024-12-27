import { CartService, MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//TODO: should be under /order
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let orderService: OrderService = req.scope.resolve('orderService');
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/cart/cancel', [
        'cart_id',
    ]);

    await handler.handle(async () => {

        //validate
        if (!handler.requireParam('cart_id'))
            return;

        const cartId = handler.inputParams.cart_id;

        const cart = await cartService.retrieve(cartId);
        if (!cart)
            return handler.returnStatusWithMessage(404, `Cart ${cartId}  not found`);

        //enforce security
        if (!handler.enforceCustomerId(cart.customer_id))
            return;

        await orderService.cancelOrderFromCart(cartId);

        handler.logger.debug(`cancelled ${cartId}`);
        return handler.returnStatus(200, { status: true });
    });
};
