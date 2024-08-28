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

        if (!store_id) {
            return res.status(400).json({ message: 'store_id is required' });
        }

        if (!handle) {
            return res.status(400).json({ message: 'handle is required' });
        }

        try {
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
        } catch (error) {
            console.error('Error occurred while fetching products:', error);
            return res.status(500).json({
                message: 'Failed to fetch products.',
                error: error.message,
            });
        }
    });
};
