import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'PUT',
        '/custom/order/change-status',
        ['order_id', 'status']
    );

    await handler.handle(async () => {
        const order = await orderService.changeFulfillmentStatus(
            handler.inputParams.order_id,
            handler.inputParams.status
        );

        res.status(200).json({ order });
    });
};
