import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/vendors/vendor-products',
        ['store_id']
    );

    await handler.handle(async () => {
        if (!handler.requireParam('store_id'))
            return;

        const products = await productService.getProductsFromStore(
            handler.inputParams.store_id
        );
        res.json(products);
    });
};
