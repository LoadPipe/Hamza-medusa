import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';
import OrderService from 'src/services/order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/order/cancel-request',
        ['store_id']
    );

    await handler.handle(async () => {
        if (!handler.inputParams.store_id) {
            return handler.returnStatus(400, {
                error: "Missing 'store_id' parameter",
            });
        }

        const allOrdersByStore = await orderService.getAllOrderIdsByStore(
            handler.inputParams.store_id
        );

        const cancelledOrders =
            await orderService.getAllCancelledOrders(allOrdersByStore);

        handler.returnStatus(200, cancelledOrders);
    });
};
