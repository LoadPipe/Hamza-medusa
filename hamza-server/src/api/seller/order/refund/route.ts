import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import OrderService from '../../../../services/order';
import StoreOrderService from '../../../../services/store-order';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'PUT', '/seller/order/refund', [
        'id',
        'order_id',
        'amount',
    ]);

    await handler.handle(async () => {
        const { id, order_id } = handler.inputParams;

        // Validate `id`
        if (!id || typeof id !== 'string') {
            return handler.returnStatusWithMessage(
                400,
                'Invalid or missing "id".'
            );
        }

        if (!order_id || typeof order_id !== 'string') {
            return handler.returnStatusWithMessage(
                400,
                'Invalid or missing "order_id".'
            );
        }

        const refund = await orderService.confirmRefund(id, order_id);

        return handler.returnStatus(200, refund);
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'POST', '/seller/order/refund', [
        'order_id',
        'amount',
        'reason',
        'note',
    ]);

    await handler.handle(async () => {
        const { order_id, amount, reason, note } = handler.inputParams;

        // Validate `order_id`
        if (!order_id || typeof order_id !== 'string') {
            return handler.returnStatusWithMessage(
                400,
                'Invalid or missing "order_id".'
            );
        }

        // Validate `amount`
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return handler.returnStatusWithMessage(
                400,
                '"amount" must be a valid positive number.'
            );
        }

        // Validate `reason`
        if (
            !reason ||
            typeof reason !== 'string' ||
            reason.trim().length === 0
        ) {
            return handler.returnStatusWithMessage(
                400,
                "Invalid or missing \"reason\" enum. Reason must be one of the following; 'discount', 'return', 'swap', 'claim', 'other'."
            );
        }

        if (!note || typeof note !== 'string' || note.trim().length === 0) {
            return handler.returnStatusWithMessage(
                400,
                'Invalid or missing "note". Reason must be a non-empty string.'
            );
        }

        const order = await orderService.createRefund(
            order_id,
            amount,
            reason,
            note
        );

        return handler.returnStatus(200, order);
    });
};
