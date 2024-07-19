import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import { LineItemService } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: LineItemService = req.scope.resolve('lineItemService');
    const logger: Logger = req.scope.resolve('logger');

    const { cart_id } = readRequestBody(req.query, ['cart_id']);

    try {
        const order = await orderService.list({ cart_id });

        res.status(200).json({ order });
    } catch (err) {
        logger.error('Error retrieving order', err);
        res.status(500).json({
            error: 'Failed to retrieve order',
        });
    }
};
