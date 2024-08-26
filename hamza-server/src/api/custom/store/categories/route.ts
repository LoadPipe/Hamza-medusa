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

    // Return error if no products in store
    await handler.handle(async () => {

        //validate 
        if (!handler.requireParams(['store_name']))
            return;

        const storeName = handler.inputParams.storeName;

        const storeData = await storeService.getStoreByName(
            storeName
        );
        console.log('Retrieved store data:', storeData);
        const products = await productService.getCategoriesByStoreId(
            storeData.id.toString()
        );
        console.log('Retrieved products:', products);

        // Return the products with categories
        return res.json(products);
    });
};
