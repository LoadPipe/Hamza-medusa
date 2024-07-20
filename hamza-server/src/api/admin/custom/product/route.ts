import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { Product } from '../../../../models/product';
import { RouteHandler } from '../../../route-handler';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService = req.scope.resolve('productService');
    const storeRepository = req.scope.resolve('storeRepository');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/product', ['products']
    );

    await handler.handle(async () => {
        const products = handler.inputParams.products;
        handler.logger.debug(`got ${products.length} products: ${products}`)

        if (!products) {
            return res
                .status(400)
                .json({ message: 'Missing products' });
        }

        const promises: Promise<Product>[] = [];
        for (let prod of products) {
            const store = (await storeRepository.findOne({ where: { name: prod.store_id } }));
            prod.store_id = store.id;
            //prod.collection_id = (await productCollectionRepository.findOne({ where: { title: prod.collection_id } })).id;

            console.log(prod);
            promises.push(productService.create(prod));
        }

        await Promise.all(promises);
        handler.logger.debug(`added ${products.length} products.`)

        return res.json({ ok: 'true' });
    });
};
