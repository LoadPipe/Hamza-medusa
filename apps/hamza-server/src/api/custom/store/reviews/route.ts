import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/store/reviews',
        ['store_id']
    );

    await handler.handle(async () => {
        const products = await productService.getProductsFromReview(
            handler.inputParams.store_id
        );
        handler.returnStatus(200, products);
    });
};
