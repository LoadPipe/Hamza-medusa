import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//COMPLETEs an order or set of orders, given a cart id
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/order/complete-template', ['cart_id']
    );

    await handler.handle(async () => {
        const cart = await orderService.completeOrderTemplate(handler.inputParams.cart_id);

        res.status(200).json({ cart });
    });
};
