import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../../services/store';
import ProductService from '../../../../../services/product';
import { RouteHandler } from '../../../../route-handler';

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
        '/custom/store/products/handle'
    );

    // Return error if no products in store
    await handler.handle(async () => {
        const { store_name, product_handle } = req.query;

        // Validate the request
        if (!store_name) {
            return res.status(400).json({ message: 'store_name is required' });
        }

        try {
            // Fetch the store data by name
            const storeData = await storeService.getStoreByName(
                store_name.toString()
            );
            console.log('Retrieved store data:', storeData);

            // Fetch the products by store ID
            const products = await productService.getCategoriesByStoreId(
                storeData.id.toString()
            );
            console.log('Retrieved products:', products);

            // Filter products by product handle if provided
            let filteredProducts = products;
            if (product_handle) {
                filteredProducts = products.filter(
                    (product: any) =>
                        product.handle === product_handle.toString()
                );
            }

            // Return the filtered products
            return res.json(filteredProducts);
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to fetch categories',
                error: error.message,
            });
        }
    });
};
