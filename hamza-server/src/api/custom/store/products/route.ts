import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import StoreService from '../../../../services/store';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store/products',
        ['store_id', 'store_name']
    );

    await handler.handle(async () => {
        if (handler.hasParam('store_id')) {
            const products = await productService.getProductsFromStore(
                handler.inputParams.store_id
            );
            res.json(products);
        } else if (handler.hasParam('store_name')) {
            const storeName = handler.inputParams.store_name;

            let list_products = [];
            if (storeName?.length) {
                const store =
                    await storeService.getStoreByHandleOrName(storeName);

                //check for store existence
                if (!store) {
                    return handler.returnStatusWithMessage(
                        404,
                        `Store not found`
                    );
                }

                // Chain query to get products
                list_products =
                    await productService.getProductsFromStoreWithPrices(
                        store.id
                    );
            } else {
                list_products = await productService.getAllProductsWithPrices();
            }

            return res.json(list_products);
        } else {
            const products = await productService.getAllProductsWithPrices();
            return handler.returnStatus(200, products);
        }
    });
};
