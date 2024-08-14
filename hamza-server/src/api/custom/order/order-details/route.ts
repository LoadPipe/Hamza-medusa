import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/order/order-details',
        ['cart_id']
    );

    await handler.handle(async () => {
        const order = await orderService.orderDetails(
            handler.inputParams.cart_id
        );
        res.status(200).json({ order });
    });
};
