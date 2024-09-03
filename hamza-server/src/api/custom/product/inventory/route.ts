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
            return res
                .status(400)
                .json({ status: false, message: 'Product ID is required' });
        }

        const inventoryData = await ProductVariantRepository.findOne({
            where: { id: variant_id.toString() },
            select: { inventory_quantity: true },
        });

        if (!inventoryData) {
            return res
                .status(404)
                .json({ status: false, message: 'Product not found' });
        }

        return res
            .status(200)
            .json({ status: true, data: inventoryData.inventory_quantity });
    });
};
