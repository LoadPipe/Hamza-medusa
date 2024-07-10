import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { Product } from '../../../../models/product';
import { readRequestBody } from '../../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    try {
        const productService = req.scope.resolve('productService');
        const productRepository = req.scope.resolve('productRepository');
        const productCollectionRepository = req.scope.resolve('productCollectionRepository');
        const storeRepository = req.scope.resolve('storeRepository');

        const { products } = readRequestBody(req.body, [
            'products',
        ]);

        logger.debug(`got ${products.length} products: ${products}`)

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
        logger.debug(`added ${products.length} products.`)

        return res.json({ ok: 'true' });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
