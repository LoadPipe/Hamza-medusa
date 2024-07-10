import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { product_id } = readRequestBody(req.body, ['product_id']);
    logger.debug(`Product ID is: ${product_id}`);

    try {
        const reviews = await productReviewService.getReviewCount(product_id);
        res.json(reviews);
    } catch (err) {
        logger.error('Error fetching product reviews:', err);
        res.status(500).json({
            error: 'Failed to fetch product reviews',
        });
    }
};
