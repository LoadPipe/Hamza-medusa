import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(
        req, res, 'POST', '/custom/order/customer-orders', ['customer_id']
    );

    await handler.handle(async () => {
        const orderService: OrderService = req.scope.resolve('orderService');
        const orders = await orderService.listCustomerOrders(handler.inputParams.customer_id);
        res.status(200).json({ orders });
    });
}
