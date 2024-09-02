import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../../../services/store';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/category/products'
    );

    // Return error if no products in store
    await handler.handle(async () => {
        const { store_id, handle } = req.query;

        if (!handler.requireParams(['store_id', 'handle']))
            return;

        const products = await productService.getAllProductsByHandle(
            store_id.toString(),
            handle.toString()
        );

        if (!products || products.length === 0) {
            return res.status(404).json({
                message:
                    'No products found for the specified store and handle.',
            });
        }

        return res.status(200).json(products);
    });
};
