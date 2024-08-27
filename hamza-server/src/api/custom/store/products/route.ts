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
    const productService: ProductService =
        req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/store/products', ['store_name']);

    await handler.handle(async () => {

        //validate 
        if (!handler.requireParams(['store_name']))
            return;

        const storeName = handler.inputParams.store_name;

        let list_products = [];
        if (storeName?.length) {

            const store = await storeService.getStoreByName(
                storeName
            );

            //check for store existence
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
    });
};
