import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/order/store', [
        'order_id',
    ]);

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParam('order_id'))
            return;

        const order = await orderService.getVendorFromOrder(
            handler.inputParams.order_id
        );

        res.status(200).json(order);
    });
};
