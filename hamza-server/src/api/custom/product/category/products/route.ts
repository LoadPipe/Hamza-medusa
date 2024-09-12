import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import StoreService from '../../../../../services/store';
import ProductService from '../../../../../services/product';
import { RouteHandler } from '../../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/product/category/products'
    );

    // Return error if no products in store
    await handler.handle(async () => {
        const { category_name } = req.query;

        // Validate the request
        if (!handler.requireParam('category_name')) return;

        // Fetch the products by store ID
        const products = await productService.getAllProductByCategory(
            category_name.toString()
        );

        // Return the filtered products
        return handler.returnStatus(200, products);
    });
};
