import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/review/existing', [
        'product_id',
        'order_id'
    ]);

    await handler.handle(async () => {
        const verify = await productReviewService.getSpecificReview(
            handler.inputParams.order_id,
            handler.inputParams.product_id
        );
        res.json(verify);
    });
};
