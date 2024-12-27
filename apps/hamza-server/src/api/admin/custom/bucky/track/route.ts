import { MedusaRequest, MedusaResponse, OrderService } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import BuckydropService from 'src/services/buckydrop';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const buckyService: BuckydropService =
        req.scope.resolve('buckydropService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/admin/custom/bucky/track',
        ['order_id']
    );

    await handler.handle(async () => {
        let output = { count: 0, orders: [] };
        let orders = [];

        if (handler.hasParam('order_id')) {
            output.count = 1;
            output.orders.push(await buckyService.reconcileOrderStatus(handler.inputParams.order_id));
        }
        else {
            orders = await buckyService.getOrdersToTrack();

            output.count = orders.length;
            for (let order of orders) {
                output.orders.push(await buckyService.reconcileOrderStatus(order.id));
            }
        }

        return handler.returnStatus(201, { output });
    });
};
