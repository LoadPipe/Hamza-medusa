import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import ProductService from '../../../services/product';
import StoreService from '../../../services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store',
        ['product_id', 'store_handle', 'store_name']
    );

    await handler.handle(async () => {
        if (handler.hasParam('product_id')) {
            const store_name = await productService.getStoreFromProduct(
                handler.inputParams.product_id
            );
            return res.json(store_name);
        } else if (handler.hasParam('store_name')) {
            const products = await productService.getProductsByStoreHandleOrName(
                handler.inputParams.store_name
            );
            return res.json(products);
        } else if (handler.hasParam('store_handle')) {
            const products = await productService.getProductsByStoreHandleOrName(
                handler.inputParams.store_handle
            );
            return res.json(products);
        } else {
            const stores = await storeService.getStores();
            return res.json(stores);
        }
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService = req.scope.resolve('customerService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/store',
        ['wallet_address', 'signature']
    );

    await handler.handle(async () => {
        if (!handler.requireParams(['wallet_address'])) return;

        const isVerified = await customerService.verifyWalletSignature(
            handler.inputParams.wallet_address,
            handler.inputParams.signature
        );
        if (!isVerified) {
            return res.status(400).json({ message: 'Verification failed' });
        }

        const customer = await customerService.createCustomer(
            handler.inputParams.wallet_address.toString()
        );

        if (!customer) {
            return res.status(409).json({
                message: 'Customer with this wallet address already exists.',
            });
        }
        return res.status(201).json({ customer });
    });
};
