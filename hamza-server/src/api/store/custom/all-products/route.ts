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
        const productService: ProductService =
            req.scope.resolve('productService');

        const list_products =
            await productService.getAllProductsFromStoreWithPrices();
        return res.json(list_products);
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
