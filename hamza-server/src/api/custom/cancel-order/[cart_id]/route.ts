import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/cancel-order', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        await orderService.cancelOrderFromCart(handler.inputParams.cart_id);
        handler.logger.debug(`cancelled ${handler.inputParams.cart_id}`);
        return res.send({ status: true });
    });
};
