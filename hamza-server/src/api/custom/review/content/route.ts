import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from '../../../../services/product-review';
import { RouteHandler } from '../../../route-handler';

//TODO: not used?
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'PATCH', '/custom/review/content', [
        'product_id', 'reviewUpdates', 'customer_id'
    ]);

    await handler.handle(async () => {
        const updatedReview = await productReviewService.updateProductReview(
            handler.inputParams.product_id,
            handler.inputParams.reviewUpdates,
            handler.inputParams.customer_id
        );
        res.json(updatedReview);
    });
};
