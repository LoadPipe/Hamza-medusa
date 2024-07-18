import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../services/store';
import ProductService from '../../../../services/product';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    try {
        logger.debug("/custom/store/products")

        //get store by name
        const storeService: StoreService = req.scope.resolve('storeService');
        const productService: ProductService =
            req.scope.resolve('productService');

        let list_products = [];
        if (req.query.store_name && req.query.store_name.length) {

            const store = await storeService.getStoreByName(
                req.query.store_name.toString()
            );

            // Simple error handing
            if (!store) {
                return res.status(404).json({ message: 'Store not found' });
            }

            // Chain query to get products
            list_products =
                await productService.getProductsFromStoreWithPrices(store.id);
        }
        else {
            list_products =
                await productService.getAllProductsFromStoreWithPrices();
        }

        return res.json(list_products);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
