import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import { Config } from '../../../config';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const userService = req.scope.resolve('userService');
    const storeService = req.scope.resolve('storeService');
    const productService = req.scope.resolve('productService');
    const productCollectionService = req.scope.resolve(
        'productCollectionService'
    );

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/admin/custom/user'
    );

    await handler.handle(async () => {
        /*
        const user0 = await userService.create(
            {
                email: 'medusaVendor@hamza.com',
                first_name: 'medusa',
                last_name: 'Vendor',
                wallet_address: '0xb794f5ea0ba39494ce839613fffba74279579268',
            },
            'password'
        );

        const user9 = await userService.create(
            {
                email: 'support@hamza.biz',
                first_name: 'Hamza',
                last_name: 'Official Shop',
                wallet_address: '0x4fBCF49cC0f91d66Bc5bBbE931913D8709592012',
            },
            'password'
        );

        const store9 = await storeService.createStore(
            user9,
            'Hamza Official',
            'pcol_01HRVF8HCVY8B00RF5S54THTPC',
            'https://images.hamza.biz/Hamza/logo.png'
        );

        await productCollectionService.update(
            'pcol_01HRVF8HCVY8B00RF5S54THTPC',
            { store_id: store9.id }
        );
        */

        const stores = await storeService.getStores();
        const products = await productService.getProductsFromStoreWithPrices();
        for (const store of stores) {
            if (store.name == 'Hamza Official') {
                await productService.update(products[0].id, { store: store.id });
            }
        }
        console.log(products);

        return res.json(stores);
    });

};
