import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler =
        new RouteHandler(
            req, res, 'GET', '/cancel-order', ['cart_id']
        );

    await handler.handle(async () => {
        let orderService: OrderService = req.scope.resolve('orderService');
        await orderService.cancelOrderFromCart(handler.inputParams.cart_id);
        handler.logger.debug(`cancelled ${handler.inputParams.cart_id}`);
        return res.send({ status: true });
    });

    /*
    const logger = req.scope.resolve('logger') as Logger;
    try {
        let { cart_id } = req.params;
        let orderService: OrderService = req.scope.resolve('orderService');
        await orderService.cancelOrderFromCart(cart_id);
        console.log('cancelled ', cart_id);
        return res.send({ status: true });
    } catch (e) {
        logger.error('error in verifying token ', e);
        return res.send({ status: false, message: e.message });
    }
    */
};
