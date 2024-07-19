import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { product_id, order_id } = readRequestBody(req.body, [
        'order_id',
        'product_id',
    ]);
    logger.debug(`Order ID is ${order_id}`);
    try {
        const verify = await productReviewService.getSpecificReview(
            order_id,
            product_id
        );
        res.json(verify);
    } catch (err) {
        logger.error('Error fetching product verification:', err);
        res.status(500).json({
            error: 'Failed to verify customer',
        });
    }
};
