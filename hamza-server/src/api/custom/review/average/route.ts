import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/review/average', [
        'product_id'
    ]);

    await handler.handle(async () => {
        const reviews = await productReviewService.getAverageRating(handler.inputParams.product_id);
        res.json(reviews);
    });
};
