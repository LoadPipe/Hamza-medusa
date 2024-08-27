import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/review/customer-reviews', [
        'product_id',
        'customer_id'
    ]);

    await handler.handle(async () => {
        const reviews = await productReviewService.getCustomerReviews(
            handler.inputParams.product_id,
            handler.inputParams.customer_id
        );
        res.json(reviews);
    });
};
