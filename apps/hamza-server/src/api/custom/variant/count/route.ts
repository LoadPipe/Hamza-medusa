import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import ProductVariantService from '../../../../services/product-variant';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/variant/count', ['variant_id']);

    await handler.handle(async () => {
        if (!handler.requireParam('variant_id'))
            return;

        const variant = await productVariantService.checkInventory(
            handler.inputParams.variant_id as string
        );
        return res.json({ variant });
    });
};
