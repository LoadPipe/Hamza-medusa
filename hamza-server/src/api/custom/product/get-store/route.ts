import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

//TODO: probably delete this
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/product/get-store'
    );

    await handler.handle(async () => {
        if (!handler.requireParam('product_id')) return;

        const productId = handler.inputParams.productId;

        let productData = await ProductRepository.findOne({
            where: { id: productId.toString() },
            select: { store_id: true },
        });

        return handler.returnStatus(200, { dta: productData.store_id });
    });
};
