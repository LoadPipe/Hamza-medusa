import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { RouteHandler } from '../../../route-handler';

/**
 * GET /custom/product/filter
 *
 * This endpoint filters products based on categories and price ranges provided
 * via query parameters. The filtering applies to published products that have
 * an associated store. If no query parameters are provided, it will return all
 * products that meet the base conditions.
 *
 * Query Parameters:
 * - `category_name` (string | array): A comma-separated list or an array of category names
 *   used to filter products. Example: `gaming,fashion` or `["gaming", "fashion"]`.
 * - `price_hi` (number): The upper price limit for filtering products. Default: 0.
 * - `price_lo` (number): The lower price limit for filtering products. Default: 0.
 *
 * Response:
 * - Returns a 200 status with a list of products that match the filtering criteria.
 *
 * @param {MedusaRequest} req - The request object containing query parameters for filtering.
 * @param {MedusaResponse} res - The response object for sending filtered products data.
 *
 * @returns {Promise<void>} - A promise that resolves when the request is completed.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/product/filter'
    );

    await handler.handle(async () => {
        //if no parameters passed, just get every product ever (excluding ones that are not PUBLISHED or don't have a store)
        const categories: string[] = Array.isArray(
            handler.inputParams.category_handles
        )
            ? handler.inputParams.category_handles
            : handler.inputParams.category_handles?.split(',') || [];

        //make sure these are cast as numbers
        const upperPrice = handler.inputParams.price_hi ?? 0;
        const lowerPrice = handler.inputParams.price_lo ?? 0;
        const currencyCode = handler.inputParams.currency_code ?? 'usdc';

        //call productService.getFilteredProducts to get the products, then return them
        const products = await productService.getFilteredProducts(
            categories,
            upperPrice,
            lowerPrice,
            currencyCode
        );

        return handler.returnStatus(200, { products }, 200);
    });
};
