import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this 
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/product/get-store');

    await handler.handle(async () => {
        let { product_id } = req.query;
        let productData = await ProductRepository.findOne({
            where: { id: product_id.toString() },
            select: { store_id: true },
        });

        return res.send({ status: true, data: productData.store_id });
    });
};
