import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'PUT', '/custom/order/status', [
        'order_id',
        'status',
        'fulfillment_status',
        'payment_status',
        'escrow_status',
        'metadata',
    ]);

    await handler.handle(async () => {
        //validate
        if (!handler.requireParams(['order_id'])) return;

        //get order
        const order = await orderService.retrieve(handler.inputParams.order_id);

        //check for order existence
        if (!order) {
            handler.response
                .status(404)
                .json({
                    message: `order ${handler.inputParams.order_id} not found.`,
                });
            return;
        }

        //enforce security
        if (!handler.enforceCustomerId(order.customer_id)) return false;

        //update order status
        const updatedOrder = await orderService.setOrderStatus(
            order,
            handler.inputParams.status,
            handler.inputParams.fulfillment_status,
            handler.inputParams.payment_status,
            handler.inputParams.escrow_status,
            handler.inputParams.metadata
        );

        handler.returnStatus(200, { order: updatedOrder });
    });
};


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/order/status', [
        'order_id',
    ]);

    await handler.handle(async () => {
        //validate
        if (!handler.requireParams(['order_id'])) return;

        //get order
        const order = await orderService.retrieve(handler.inputParams.order_id);

        //check for order existence
        if (!order) {
            handler.response
                .status(404)
                .json({
                    message: `order ${handler.inputParams.order_id} not found.`,
                });
        }

        //enforce security
        if (!handler.enforceCustomerId(order.customer_id)) return false;

        handler.returnStatus(200, { order: order.status });
    });
};
