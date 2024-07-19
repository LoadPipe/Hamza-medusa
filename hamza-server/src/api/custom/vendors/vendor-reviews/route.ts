import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req, res, 'POST', '/custom/vendors/vendor-reviews', ['store_id']
    );

    await handler.handle(async () => {
        //TODO: are these products being returned?
        const products = await productService.getProductsFromReview(handler.inputParams.store_id);
        res.json(products);
    });
};
