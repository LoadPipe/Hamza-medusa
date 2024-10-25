import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CartService from '../../../../services/cart';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let cartService: CartService = req.scope.resolve('cartService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/cart/recover', [
        'customer_id', 'cart_id'
    ]);

    await handler.handle(async () => {
        //validate
        if (!handler.requireParam('customer_id')) return;
        const { customer_id, cart_id } = handler.inputParams;

        //check for existence
        const cart = await cartService.recover(customer_id, cart_id);
        if (!cart)
            return handler.returnStatusWithMessage(404, `Cart for customer ${customer_id} not found`);

        //enforce security
        if (!handler.enforceCustomerId(customer_id))
            return;

        return handler.returnStatus(200, { cart });
    });
};

