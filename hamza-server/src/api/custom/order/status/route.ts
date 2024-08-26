import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/order/status', [
        'order_id', 'token'
    ]);

    await handler.handle(async () => {
        const order = await orderService.orderStatus(
            handler.inputParams.order_id
        );

        if (!handler.enforceCustomerId())
            return false;

        res.status(200).json({ order });
    });
};
