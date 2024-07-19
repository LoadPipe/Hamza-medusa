import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import OrderService from '../../../../services/order';
import { RouteHandler } from '../../../route-handler';

//TODO: does not need to be DELETE (cancelling is not deleting)
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const logger: Logger = req.scope.resolve('logger');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/order/cancel', ['order_id']
    );

    const { order_id } = readRequestBody(req.query, ['order_id']);

    try {
        const order = await orderService.cancellationStatus(order_id);

        res.status(200).json({ order });
    } catch (err) {
        logger.error('Error retrieving order', err);
        res.status(500).json({
            error: 'Failed to retrieve order',
        });
    }
};
