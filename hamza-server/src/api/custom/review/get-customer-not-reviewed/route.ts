import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import OrderService from 'src/services/order';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('OrderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/review/get-customer-not-reviewed',
        ['customer_id']
    );

    await handler.handle(async () => {
        const reviews = await orderService.getNotReviewedOrders(
            handler.inputParams.customer_id
        );
        res.json(reviews);
    });
};
