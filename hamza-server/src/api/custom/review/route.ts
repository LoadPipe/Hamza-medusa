import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { product_id, title, customer_id, content, rating, order_id } =
        readRequestBody(req.body, [
            'product_id',
            'title',
            'customer_id',
            'content',
            'rating',
            'order_id',
        ]);

    logger.debug(
        'product_id: ' +
        product_id +
        'title: ' +
        title +
        'customer_id: ' +
        customer_id +
        'content: ' +
        content +
        'rating: ' +
        rating +
        'order_id: ' +
        order_id
    );

    try {
        const review = await productReviewService.addProductReview(product_id, {
            title,
            customer_id,
            content,
            rating,
            order_id,
        });
        res.json(review);
    } catch (err) {
        logger.error('Error creating product review:', err);
        res.status(500).json({
            error: 'Failed to create product review',
        });
    }
};
