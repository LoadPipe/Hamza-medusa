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

        // Validate the request: category_name must be provided
        if (!handler.requireParam('category_name')) return;

        let products;

        // If `category_name` is an array of strings, handle it as multiple categories.
        if (Array.isArray(category_name)) {
            // If multiple categories are passed
            const categoryArray = category_name as string[]; // Cast to string[] directly
            products =
                await productService.getAllProductsByMultipleCategories(
                    categoryArray
                );
        } else {
            // If a single category is passed
            products = await productService.getAllProductByCategory(
                category_name.toString() // Convert single category to string
            );
        }

        // Return the filtered products
        return handler.returnStatus(200, products);
    });
};
