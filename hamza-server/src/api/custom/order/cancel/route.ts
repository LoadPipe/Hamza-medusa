import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//CANCELs an order, given its order id
//TODO: does not need to be DELETE (cancelling is not deleting)
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/order/cancel',
        ['order_id']
    );

    await handler.handle(async () => {
        const order = await orderService.cancellationStatus(
            'order_01J5Q50W8EBRJY2058W581QSJZ'
        );

        res.status(200).json({ order });
    });
};
