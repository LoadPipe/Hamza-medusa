import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import WhiteListService from '../../../services/whitelist';
import StoreService from '../../../services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const whitelistService: WhiteListService =
        req.scope.resolve('whitelistService');

    const setUpWhitelist = async (storeName: string) => {
        const store = await storeService.getStoreByHandleOrName(storeName);
        const whitelistAddresses = [
            '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
        ];

        console.log(store.id);

        if (store) {
            await Promise.all(
                whitelistAddresses.map((a) => {
                    return whitelistService.create(store.id, a);
                })
            );
        }
    };

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/whitelist',
        ['store']
    );

    await handler.handle(async () => {
        await setUpWhitelist(handler.inputParams.store ?? '');
        handler.returnStatus(200, {});
    });
};
