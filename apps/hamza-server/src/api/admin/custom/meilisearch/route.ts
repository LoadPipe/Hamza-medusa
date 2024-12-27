import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/meilisearch'
    );

    await handler.handle(async () => {
        const product = await productService.reindexProducts();
        if (product === null)
            return handler.returnStatusWithMessage(404, `Product not found`);

        return handler.returnStatus(200, product);
    });
};
