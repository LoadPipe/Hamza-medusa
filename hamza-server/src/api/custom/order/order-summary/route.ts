import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//COMPLETEs an order or set of orders, given a cart id
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/order/complete-template',
        ['cart_id']
    );

    await handler.handle(async () => {
        if (!handler.requireParam('cart_id'))
            return;

        const cartId = handler.inputParams.cart_id;

        const output = await orderService.completeOrderTemplate(cartId);

        //enforce security
        if (!handler.enforceCustomerId(output.cart.customer_id))
            return;

        res.status(200).json({ items: output.items });
    });
};
