import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/store/name', [
        'store_id',
    ]);

    await handler.handle(async () => {
        if (!handler.inputParams.store_id) {
            return handler.returnStatus(400, {
                error: "Missing 'store_id' parameter",
            });
        }

        const stores = await storeService.getStoreNameById(
            handler.inputParams.store_id
        );
        handler.returnStatus(200, stores);
    });
};
