import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../../route-handler';

//TODO: this is not used?
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/review/bought', [
        'product_id', 'customer_id'
    ]);

    await handler.handle(async () => {
        //validate params 
        if (!handler.requireParams(['product_id', 'customer_id']))
            return;

        //enforce security 
        if (!handler.enforceCustomerId(handler.inputParams.customer_id))
            return;

        const verify = await productReviewService.customerHasBoughtProduct(
            handler.inputParams.customer_id,
            handler.inputParams.product_id
        );

        res.json(verify);
    });
};
