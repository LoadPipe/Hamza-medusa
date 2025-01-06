import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import StoreOrderService from '../../../../../services/store-order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeOrderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/order/escrow/status'
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('order_id')) {
            return;
        }

        // Return the updated order details in the response
        return handler.returnStatus(
            200,
            await storeOrderService.getEscrowPayment(
                handler.inputParams.order_id
            )
        );
    });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeOrderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(
        req,
        res,
        'PUT',
        '/seller/order/escrow/status',
        ['order_id']
    );

    const validStatuses = [
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Refunded',
    ];

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('order_id')) {
            return;
        }

        // Return the updated order details in the response

        // Return the updated order details in the response
        return handler.returnStatus(
            200,
            await storeOrderService.syncEscrowPayment(
                handler.inputParams.order_id
            )
        );
    });
};
