import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductService from 'src/services/product';
import { readRequestBody } from '../../../utils/request-body';
import { RouteHandler } from '../../route-handler';

//TODO: should this not just be GET /store?
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/custom/get-store', ['product_id']
    );

    const logger = req.scope.resolve('logger') as Logger;
    const { product_id } = readRequestBody(req.body, ['product_id']);
    logger.debug(`Product ID is: ${product_id}`);

    try {
        const store_name = await productService.getStoreFromProduct(product_id);
        res.json(store_name);
    } catch (err) {
        logger.error('Error fetching store:', err);
        res.status(500).json({
            error: 'Failed to fetch store',
        });
    }
};
