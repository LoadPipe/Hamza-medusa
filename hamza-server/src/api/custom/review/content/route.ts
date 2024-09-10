import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from '../../../../services/product-review';
import { RouteHandler } from '../../../route-handler';

//TODO: not used?
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PATCH',
        '/custom/review/content',
        ['product_id', 'review_updates', 'customer_id']
    );

    await handler.handle(async () => {
        //validate prams
        if (!handler.requireParams(['product_id', 'customer_id'])) return;

        //enforce security
        if (!handler.enforceCustomerId(handler.inputParams.customer_id)) return;

        const updatedReview = await productReviewService.updateProductReview(
            handler.inputParams.product_id,
            handler.inputParams.review_updates,
            handler.inputParams.customer_id
        );
        handler.returnStatus(200, updatedReview);
    });
};
