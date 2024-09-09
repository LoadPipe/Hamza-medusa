import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/review/average',
        ['product_id']
    );

    await handler.handle(async () => {
        //validate params
        if (!handler.requireParam('product_id')) return;

        const reviews = await productReviewService.getAverageRating(
            handler.inputParams.product_id
        );
        handler.returnStatus(200, reviews);
    });
};
