import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../../../services/store';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/store/id');

    await handler.handle(async () => {
        const { store_name } = req.query; // Get the store_name from query parameters

        if (!store_name || typeof store_name !== 'string') {
            res.status(400).json({
                error: 'store_name is required and must be a string',
            });
            return;
        }

        try {
            const store = await storeService.getStoreByName(store_name);
            res.json({ id: store.id, name: store.name });
        } catch (error) {
            res.status(404).json({
                error: `Store with name ${store_name} not found`,
            });
        }
    });
};
