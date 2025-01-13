import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../../../services/store';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/store/id');

    await handler.handle(async () => {
        if (!handler.requireParam('store_name')) return;

        const store = await storeService.getStoreByHandleOrName(
            handler.inputParams.store_name
        );
        if (!store)
            return handler.returnStatusWithMessage(
                404,
                `Store with name ${handler.inputParams.store_name}  not found`
            );

        handler.returnStatus(200, { id: store.id, name: store.name });
    });
};
