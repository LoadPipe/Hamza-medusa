import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/review/count', [
        'product_id'
    ]);

    await handler.handle(async () => {
        const reviews = await productReviewService.getReviewCount(handler.inputParams.product_id);
        res.json(reviews);
    });
};
