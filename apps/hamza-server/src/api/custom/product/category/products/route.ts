import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../../../../services/store';
import ProductService from '../../../../../services/product';
import { RouteHandler } from '../../../../route-handler';

/**
 * @route   GET /custom/product/category/products
 *
 * @desc    Fetches all products that belong to one or more specified product categories.
 *          The categories can be passed as a comma-separated string in the query parameter `category_name`.
 *          If multiple categories are provided, the handler will return products that belong to all of the categories but not just one.
 *
 * @query   category_name - A string of category names (e.g., "fashion,featured") to filter products by.
 *
 * @returns {Object} 200 - An array of products filtered by the provided category/categories.
 *          If no category is specified or none matches, it returns an empty array.
 *
 * @throws  400 - If the category_name parameter is missing or invalid.
 */

//TODO: can be removed
/*
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

        if (category_name === 'All') {
            products =
                await productService.getAllProductsWithPrices();
        }
        else {
            products =
                await productService.getAllProductsByMultipleCategories(categories);
        }

        // Return the filtered products
        return handler.returnStatus(200, products);
    });
};
*/
