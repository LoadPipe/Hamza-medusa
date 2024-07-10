import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from '../../../../services/product-review';
import { readRequestBody } from '../../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { product_id, reviewUpdates, ratingUpdates, customer_id, order_id } =
        readRequestBody(req.body, [
            'product_id',
            'reviewUpdates',
            'ratingUpdates',
            'customer_id',
            'order_id',
        ]);

    logger.debug(
        'product_id: ' +
            product_id +
            'reviewUpdates: ' +
            reviewUpdates +
            'ratingUpdates: ' +
            ratingUpdates +
            'customer_id: ' +
            customer_id +
            'order_id: ' +
            order_id
    );

    try {
        const updatedReview = await productReviewService.updateProduct(
            product_id,
            reviewUpdates,
            ratingUpdates,
            customer_id,
            order_id
        );
        res.json(updatedReview);
    } catch (err) {
        logger.error('Error updating product review:', err);
        res.status(500).json({
            error: 'Failed to update product review',
        });
    }
};
