import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/product/inventory'
    );

    await handler.handle(async () => {
        const { variant_id } = req.query;

        if (!variant_id) {
            return handler.returnStatus(400, {
                status: false,
                message: 'Product ID is required',
            });
        }

        const inventoryData = await ProductVariantRepository.findOne({
            where: { id: variant_id.toString() },
            select: { inventory_quantity: true },
        });

        if (!inventoryData) {
            return handler.returnStatus(404, {
                status: false,
                message: 'Product not found',
            });
        }

        return handler.returnStatus(200, {
            status: true,
            data: inventoryData.inventory_quantity,
        });
    });
};
