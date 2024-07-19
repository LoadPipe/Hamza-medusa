import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductVariantService from '../../../../services/product-variant';
import { readRequestBody } from '../../../../utils/request-body';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );
    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/store', ['variant_id']);

    await handler.handle(async () => {
        const variant = await productVariantService.checkInventory(
            handler.inputParams.variant_id as string
        );
        return res.json({ variant });
    });
};
