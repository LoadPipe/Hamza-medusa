import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import StoreService from '../../../services/store';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/vendors');

    await handler.handle(async () => {
        const stores = await storeService.getStores();
        res.json(stores);
    });
};
