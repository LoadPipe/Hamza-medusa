import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import StoreService from '../../../../../services/store';
import ProductService from '../../../../../services/product';
import { RouteHandler } from '../../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store/products/category-name'
    );

    // Return error if no products in store
    await handler.handle(async () => {
        // Fetch the store data by name
        const storeData = await storeService.getStoreByName(
            handler.inputParams.store_name.toString()
        );

        const categories: string[] = Array.isArray(
            handler.inputParams.category_name
        )
            ? handler.inputParams.category_name
            : handler.inputParams.category_name?.split(',') || [];

        const currencyCode = handler.inputParams.currency_code ?? 'usdc';

        // Fetch the products by store ID
        const products = await productService.getFilteredProducts(
            categories,
            0,
            0,
            currencyCode,
            storeData.id.toString()
        );

        // Return the filtered products
        return handler.returnStatus(200, products, 200);
    });
};
