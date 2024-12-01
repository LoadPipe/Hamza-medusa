import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import OrderService from '../../../../services/order';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/mock-orders'
    );

    await handler.handle(async () => {
        const order = await orderService.createMockOrders();
        if (order === null)
            return handler.returnStatusWithMessage(
                404,
                `FAILED TO CREATE MOCK ORDER`
            );

        return handler.returnStatus(200, order);
    });
};
