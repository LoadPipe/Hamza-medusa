import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from '../../../../services/product-review';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { product_id, reviewUpdates, customer_id } = readRequestBody(
        req.body,
        ['product_id', 'reviewUpdates', 'customer_id']
    );

    logger.debug(
        'product_id: ' +
        product_id +
        'reviewUpdates: ' +
        reviewUpdates +
        'customer_id: ' +
        customer_id
    );

    try {
        const updatedReview = await productReviewService.updateProductReview(
            product_id,
            reviewUpdates,
            customer_id
        );
        res.json(updatedReview);
    } catch (err) {
        logger.error('Error updating product review:', err);
        res.status(500).json({
            error: 'Failed to update product review',
        });
    }
};
