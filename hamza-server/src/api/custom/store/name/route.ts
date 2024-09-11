import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import StoreService from '../../../../services/store';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/store/name');

    await handler.handle(async () => {
        const stores = await storeService.getStoreNames();
        handler.returnStatus(200, stores);
    });
};
