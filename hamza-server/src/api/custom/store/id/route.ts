import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../../../services/store';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/store/id');

    await handler.handle(async () => {
        const { store_name } = req.query; // Get the store_name from query parameters

        if (!handler.requireParam('store_name'))
            return;

        const store = await storeService.getStoreByName(handler.inputParams.store_name);
        if (!store)
            return res.status(404).json({ message: `Store with name ${handler.inputParams.store_name}  not found` });

        res.status(200).json({ id: store.id, name: store.name });
    });
};
