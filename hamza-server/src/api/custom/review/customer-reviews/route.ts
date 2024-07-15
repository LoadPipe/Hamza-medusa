import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../../utils/request-body';

//TODO: this and all-reviews can be consolidated 

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { product_id, customer_id } = readRequestBody(req.body, [
        'product_id',
        'customer_id',
    ]);
    logger.debug(
        `Product ID is: ${product_id}, Customer ID is: ${customer_id}`
    );

    try {
        const reviews = await productReviewService.getCustomerReviews(
            product_id,
            customer_id
        );
        res.json(reviews);
    } catch (err) {
        logger.error('Error fetching product reviews:', err);
        res.status(500).json({
            error: 'Failed to fetch product reviews',
        });
    }
};
