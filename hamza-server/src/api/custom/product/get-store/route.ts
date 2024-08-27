import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this 
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/product/get-store', ['product_id']);

    await handler.handle(async () => {
        let productId = handler.inputParams.product_id;
        let productData = await ProductRepository.findOne({
            where: { id: productId },
            select: { store_id: true },
        });

        return res.send({ status: true, data: productData.store_id });
    });
};
