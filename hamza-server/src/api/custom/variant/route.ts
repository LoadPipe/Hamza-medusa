import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductVariantService from '../../../services/product-variant';
import { RouteHandler } from '../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/store', [
        'variant_id',
        'reduction_quantity',
    ]);

    await handler.handle(async () => {
        handler.logger.debug(`Variant Quantity is ${handler.inputParams.reduction_quantity}`);
        const quantityToDeduct = handler.inputParams.reduction_quantity
            ? parseInt(handler.inputParams.reduction_quantity, 10)
            : 1;
        handler.logger.debug(`Quantity to deduct: ${quantityToDeduct}`); // Add this log to verify the parsed quantity

        const updatedVariant = await productVariantService.updateInventory(
            handler.inputParams.variant_id,
            quantityToDeduct
        );
        return res.json({ updatedVariant });
    });

    /*
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
        */
};
