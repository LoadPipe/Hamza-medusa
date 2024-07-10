import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductVariantService from '../../../services/product-variant';
import { readRequestBody } from '../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );

    const { variant_id, reduction_quantity, test } = readRequestBody(req.body, [
        'variant_id',
        'reduction_quantity',
    ]);

    try {
        // Defaulting quantity to deduct to 1 if not provided
        logger.debug(`Variant Quantity is ${reduction_quantity}`);
        const quantityToDeduct = reduction_quantity
            ? parseInt(reduction_quantity, 10)
            : 1;
        logger.debug(`Quantity to deduct: ${quantityToDeduct}`); // Add this log to verify the parsed quantity

        const updatedVariant = await productVariantService.updateInventory(
            variant_id,
            quantityToDeduct
        );
        return res.json({ updatedVariant });
    } catch (err) {
        logger.error('Error updating variant:', err);
        res.status(500).json({
            error: 'Failed to update variant',
        });
    }
};
