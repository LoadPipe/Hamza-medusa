import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductVariantService from '../../../services/product-variant';
import { RouteHandler } from '../../route-handler';

//TODO: this should be PUT
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/variant',
        ['variant_id', 'reduction_quantity']
    );

    await handler.handle(async () => {
        handler.logger.debug(
            `Variant Quantity is ${handler.inputParams.reduction_quantity}`
        );
        const quantityToDeduct = handler.inputParams.reduction_quantity
            ? parseInt(handler.inputParams.reduction_quantity, 10)
            : 1;
        handler.logger.debug(`Quantity to deduct: ${quantityToDeduct}`); // Add this log to verify the parsed quantity

        const updatedVariant = await productVariantService.updateInventory(
            handler.inputParams.variant_id,
            quantityToDeduct
        );
        return handler.returnStatus(200, updatedVariant);
    });
};
