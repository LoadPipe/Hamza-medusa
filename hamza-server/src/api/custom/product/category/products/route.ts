import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
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
        const { category_name } = handler.inputParams; // Use handler.inputParams instead of req.query

        // Validate the request: category_name must be provided
        if (!handler.requireParam('category_name')) return;

        // Split the category_name into an array, handling both single and multiple categories
        const categories: string[] = Array.isArray(category_name)
            ? category_name // Already an array, no need to split
            : category_name.split(','); // Split comma-separated string

        let products;

        // Check if there are multiple categories or just one
        if (categories.length > 1) {
            // If multiple categories are passed
            products =
                await productService.getAllProductsByMultipleCategories(
                    categories
                );
        } else {
            // If a single category is passed
            products = await productService.getAllProductByCategory(
                categories[0]
            );
        }

        // Return the filtered products
        return handler.returnStatus(200, products);
    });
};
