import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/order/details',
        ['cart_id']
    );

    await handler.handle(async () => {
        const order = await orderService.getOrderDetails(
            handler.inputParams.cart_id
        );

        //check for order existence 

        res.status(200).json({ order });
    });
};
