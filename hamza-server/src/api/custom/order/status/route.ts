import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const logger: Logger = req.scope.resolve('logger');

    const { order_id } = readRequestBody(req.query, ['order_id']);

    try {
        const order = await orderService.orderStatus(order_id);

        res.status(200).json({ order });
    } catch (err) {
        logger.error('Error retrieving order', err);
        res.status(500).json({
            error: 'Failed to retrieve order',
        });
    }
};
