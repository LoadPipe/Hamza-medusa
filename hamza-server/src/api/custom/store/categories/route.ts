import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../services/store';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store/categories'
    );

    await handler.handle(async () => {
        const { store_id } = req.query;

        // Validate the request
        if (!store_id) {
            return res.status(400).json({ message: 'store_id is required' });
        }

        // Fetch the categories by store ID
        try {
            const productCategories =
                await productService.getCategoriesByStoreId(
                    store_id.toString()
                );

            // Return the products with categories
            return res.json(productCategories);
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to fetch categories',
                error: error.message,
            });
        }
    });
};
