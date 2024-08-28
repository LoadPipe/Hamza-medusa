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
        '/custom/review/exists',
        ['order_id', 'customer_id', 'variant_id']
    );

    await handler.handle(async () => {
        if (!handler.requireParams(['order_id', 'customer_id', 'variant_id']))
            return;

        const verify = await productReviewService.customerHasLeftReview(
            handler.inputParams.order_id,
            handler.inputParams.customer_id,
            handler.inputParams.variant_id
        );
        res.json(verify);
    });
};
