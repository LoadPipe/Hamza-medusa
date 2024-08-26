import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { RouteHandler } from '../../../route-handler';

/*
- client -side: 
    - from where is it called? 
        - if it's not, then consider deleting or marking for deletion
        - if it is, make sure the call is in src/data/index.ts 
        - if the client-side call needs security, add header 
- server-side:
    - does it have a good name? 
    - it it in the right place? 
    - does it have the right verb? 
    - add required fields validation using handler.requireParams 
    - if it needs security, use handler.enforceCustomerId(), passing the id of the only authorized customer 
    - replace req.query.X with handler.inputParams.X 
    - remove commented-out big sections of code from route  
    - make sure that the verb & route passed to RouteHandler constructor are accurate 

NOTE: you don't need a try/catch inside of RouteHandler.handle 
*/

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
