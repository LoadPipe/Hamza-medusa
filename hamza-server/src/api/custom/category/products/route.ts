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
        if (!handler.requireParams(['handle'])) return;

        let storeId = handler.inputParams.store_id;
        if (!handler.hasParam('store_id')) {
            if (handler.hasParam('store_name')) {
                const store = await storeService.getStoreByHandleOrName(
                    handler.inputParams.store_name
                );
                if (!store) {
                    return handler.returnStatusWithMessage(
                        404,
                        `Store ${handler.inputParams.store_name} not found`
                    );
                }
                storeId = store.id;
            } else {
                return handler.returnStatusWithMessage(
                    401,
                    `Either store_name or store_id is required`
                );
            }
        }

        const products = await productService.getAllProductsByCategoryHandle(
            storeId,
            handler.inputParams.handle
        );

        if (!products || products.length === 0) {
            return handler.returnStatusWithMessage(
                404,
                'No products found for the specified store and handle.'
            );
        }

        return handler.returnStatus(200, { products });
    });
};
