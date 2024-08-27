import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductReviewService from 'src/services/product-review';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productReviewService: ProductReviewService = req.scope.resolve(
        'productReviewService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/review/verify', [
        'customer_id'
    ]);

    //TODO: this doesn't need to be here; it exists elsewhere for sure
    await handler.handle(async () => {
        const verify =
            await productReviewService.customerIsVerified(handler.inputParams.customer_id);
        res.json(verify);
    });
};
