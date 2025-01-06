import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreOrderService from '../../../../services/store-order';

/**
 * Retrieves detailed information about a specific order
 *
 * INPUTS:
 * order_id: string
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/order/details', [
        'order_id',
    ]);

    await handler.handle(async () => {
        // Ensure order_id is provided
        if (!handler.requireParam('order_id')) return;

        const orderId: string = handler.inputParams.order_id;

        // Call the service to fetch order details
        const orderDetails = await orderService.getOrderDetails(orderId);

        // Return the order details in the response
        return handler.returnStatus(200, orderDetails, 50);
    });
};
