import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/product/filter'
    );

    await handler.handle(async () => {
        //if no parameters passed, just get every product ever (excluding ones that are not PUBLISHED or don't have a store)
        const categories: string[] = Array.isArray(
            handler.inputParams.category_name
        )
            ? handler.inputParams.category_name
            : handler.inputParams.category_name?.split(',') || [];
        //make sure these are cast as numbers
        const upperPrice = handler.inputParams.price_hi ?? 0;
        const lowerPrice = handler.inputParams.price_lo ?? 0;

        //call productService.getFilteredProducts to get the products, then return them
        const products = await productService.getFilteredProductsByCategory(
            ['fashion', 'gaming'],
            upperPrice,
            lowerPrice
        );

        return handler.returnStatus(200, { products });
    });
};
