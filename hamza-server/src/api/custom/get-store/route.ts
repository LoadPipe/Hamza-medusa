import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { RouteHandler } from '../../route-handler';

//TODO: should this not just be GET /store?
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/get-store', ['product_id']
    );

    await handler.handle(async () => {
        //validate 
        if (!handler.requireParams(['product_id']))
            return;

        const store_name = await productService.getStoreFromProduct(handler.inputParams.product_id);
        res.json(store_name);
    });
};
