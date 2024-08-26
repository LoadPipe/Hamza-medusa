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
        '/custom/review/get-customer-not-reviewed',
        ['customer_id']
    );

    await handler.handle(async () => {
        const reviews = await productReviewService.getNotReviewedOrders(
            handler.inputParams.customer_id
        );
        res.json(reviews);
    });
};
