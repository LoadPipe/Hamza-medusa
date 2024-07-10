import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const { customer_id, product_id } = readRequestBody(req.body, [
        'customer_id',
        'product_id',
    ]);
    logger.debug(
        `Customer ID is: ${customer_id} and Product ID is: ${product_id}`
    );
    try {
        const verify = await productReviewService.customerHasBoughtProduct(
            customer_id,
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
