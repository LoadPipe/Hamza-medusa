import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/order/vendor', [
        'order_id',
    ]);

    await handler.handle(async () => {
        const order = await orderService.getVendorFromOrder(
            handler.inputParams.order_id
        );

        res.status(200).json(order);
    });
};
