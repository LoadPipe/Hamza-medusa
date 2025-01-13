import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../services/store';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

//TODO: this route doesn't do anything with categories; its name is wrong (if still used)
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
        const { store_name } = req.query;

        // Validate the request
        if (!handler.requireParam('store_name')) return;

        // Fetch the categories by store ID
        const storeData = await storeService.getStoreByHandleOrName(
            store_name.toString()
        );

        if (!storeData) {
            return handler.returnStatusWithMessage(
                404,
                `Store ${store_name} not found`
            );
        }

        const categories = await productService.getCategoriesByStoreId2(
            storeData.id.toString()
        );

        // Return the products with categories
        return handler.returnStatus(200, categories, 200);
    });
};
