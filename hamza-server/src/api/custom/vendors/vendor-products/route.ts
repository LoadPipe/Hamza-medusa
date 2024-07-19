import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../../utils/request-body';
import ProductService from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productService: ProductService = req.scope.resolve('productService');

    const { store_id } = readRequestBody(req.body, ['store_id']);
    // logger.log('store_id: ' + store_id); // Potential source of the error
    try {
        const products = await productService.getProductsFromStore(store_id);
        res.json(products);
    } catch (err) {
        // logger.error('Error fetching stores:', err);
        res.status(500).json({
            error: 'Failed to fetch stores',
        });
    }
};
