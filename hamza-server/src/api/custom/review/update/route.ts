import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from '../../../../services/product-review';
import { RouteHandler } from '../../../route-handler';

//TODO: update routes should be PUT instead of POST (and don't need their own folders)
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/custom/review/update',
        [
            'product_id',
            'reviewUpdates',
            'ratingUpdates',
            'customer_id',
            'order_id',
        ]
    );

    await handler.handle(async () => {
        const updatedReview = await productReviewService.updateProduct(
            handler.inputParams.product_id,
            handler.inputParams.reviewUpdates,
            handler.inputParams.ratingUpdates,
            handler.inputParams.customer_id,
            handler.inputParams.order_id
        );
        res.json(updatedReview);
    });
};
