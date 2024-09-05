import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/category/all'
    );

    // Handle the route without any parameters
    await handler.handle(async () => {
        // Fetch all product categories
        const productCategories =
            await productService.getAllProductCategories();

        if (!productCategories || productCategories.length === 0) {
            return res.status(404).json({
                message: 'No product categories found',
            });
        }

        // Return all product categories with their products
        return res.status(200).json(productCategories);
    });
};
