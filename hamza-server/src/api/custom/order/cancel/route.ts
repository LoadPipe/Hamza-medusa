import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//CANCELs an order, given its order id
//TODO: does not need to be DELETE (cancelling is not deleting)
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/order/cancel',
        ['order_id']
    );

    await handler.handle(async () => {
        const order = await orderService.cancelOrder(
            handler.inputParams.order_id
        );

        handler.logger.debug(`Order ${handler.inputParams.order_id} cancelled.`);
        res.status(200).json({ order });
    });
};
