import type { MedusaRequest, MedusaResponse, Logger, CustomerService } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import { FulfillmentStatus, LineItemService, OrderStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import OrderService from 'src/services/order';

// TODO: consider refactoring singular and plural routes - this sounds like a singular route, but returning an array
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(req, res, 'POST', '/custom/order', [
        'cart_id',
        'customer_id',
        'order_id',
    ]);

    await handler.handle(async () => {
        try {
            const lineItemService: LineItemService = req.scope.resolve('lineItemService');
            const orderService: OrderService = req.scope.resolve('orderService');
            const customerService: CustomerService =
                req.scope.resolve('customerService');

            if (handler.inputParams.cart_id) {
                const order = await lineItemService.list({
                    cart_id: handler.inputParams.cart_id,
                });
        
                handler.returnStatus(200, order);
            }
            
            //validate
            const customerId = handler.inputParams.customer_id;
            const orderId = handler.inputParams.order_id;

            if (!handler.inputParams.customer_id?.length) {
                res.status(400).json({ message: 'customer_id is required' });
            }

            if (!handler.inputParams.order_id?.length) {
                res.status(400).json({ message: 'order_id is required' });
            }

            //check for existence of customer
            if (!(await customerService.retrieve(customerId))) {
                res.status(404).json({
                    message: `Customer id ${customerId} not found`,
                });
            }

            //enforce security
            if (!handler.enforceCustomerId(customerId)) return;

            const orders = await orderService.getCustomerOrdersByStatus(customerId, {}, orderId);

            handler.returnStatus(200, orders);
        } catch (e: any) {
            handler.logger.error(e);
            handler.returnStatusWithMessage(500, 'Failed to get order');
        }
    });
};
