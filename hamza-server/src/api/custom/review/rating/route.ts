import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from '../../../../services/product-review';
import { RouteHandler } from '../../../route-handler';

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PATCH',
        '/custom/review/rating',
        ['product_id', 'rating', 'customer_id']
    );

    await handler.handle(async () => {
        const updatedReview = await productReviewService.updateProduct(
            handler.inputParams.product_id,
            handler.inputParams.rating,
            handler.inputParams.review,
            handler.inputParams.order_id,
            handler.inputParams.customer_id
        );
        res.json(updatedReview);
    });
};
