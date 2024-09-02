import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import ProductService from 'src/services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/store',
        ['product_id']
    );

    await handler.handle(async () => {
        if (handler.inputParams.product_id?.length) {
            const store_name = await productService.getStoreFromProduct(
                handler.inputParams.product_id
            );
            res.json(store_name);
        } else if (handler.inputParams.store_name?.length) {
            const products = await productService.getProductsFromStoreName(
                handler.inputParams.store_name
            );
            res.json(products);
        } else {
            res.status(400).json({ message: 'Required parameters missing' });
        }
    });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/store',
        ['wallet_address', 'signature']
    );

    await handler.handle(async () => {
        if (!handler.requireParams(['wallet_address'])) return;

        const customerService = req.scope.resolve('customerService');

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
