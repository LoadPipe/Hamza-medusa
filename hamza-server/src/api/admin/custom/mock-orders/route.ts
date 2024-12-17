import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import OrderService from '../../../../services/order';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/admin/custom/mock-orders',
        ['count', 'date', 'store_id']
    );

    await handler.handle(async () => {
        let { count, date, store_id } = handler.inputParams;

        if (!count) count = 1;

        // Validate input parameters
        if (isNaN(parseInt(count, 10)) || parseInt(count, 10) <= 0) {
            return handler.returnStatusWithMessage(400, 'Invalid count');
        }

        const order = await orderService.createMockOrders(
            count,
            date,
            store_id
        );
        if (order === null)
            return handler.returnStatusWithMessage(
                404,
                `FAILED TO CREATE MOCK ORDER`
            );

        return handler.returnStatus(200, order);
    });
};
