import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/review', [
        'product_id',
        'title',
        'customer_id',
        'content',
        'rating',
        'order_id'
    ]);

    await handler.handle(async () => {
        const review = await productReviewService.addProductReview(handler.inputParams.product_id, {
            title: handler.inputParams.title,
            customer_id: handler.inputParams.customer_id,
            content: handler.inputParams.content,
            rating: handler.inputParams.rating,
            order_id: handler.inputParams.order_id,
        });
        res.json(review);
    });
};
