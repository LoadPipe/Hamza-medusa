import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductVariantService from '../../../../services/product-variant';
import { readRequestBody } from '../../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );
    const logger: Logger = req.scope.resolve('logger');

    // Assuming your framework supports JSON parsing middleware
    const { variant_id } = readRequestBody(req.body, ['variant_id']);

    try {
        const variant = await productVariantService.checkInventory(
            variant_id as string
        );
        return res.json({ variant });
    } catch (err) {
        logger.error('Error checking inventory:', err);
        res.status(500).json({
            error: 'Failed to check inventory',
        });
    }
};
