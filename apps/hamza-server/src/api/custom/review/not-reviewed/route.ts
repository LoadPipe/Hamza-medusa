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
        '/custom/review/not-reviewed',
        ['customer_id']
    );

    await handler.handle(async () => {
        //validate params
        if (!handler.requireParam('customer_id')) return;

        //security
        if (!handler.enforceCustomerId(handler.inputParams.customer_id)) return;

        const reviews = await productReviewService.getNotReviewedOrders(
            handler.inputParams.customer_id
        );
        handler.returnStatus(200, reviews);
    });
};
