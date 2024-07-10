import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../../../utils/request-body';
import StoreService from '../../../services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;
    const storeService: StoreService = req.scope.resolve('storeService');

    try {
        const stores = await storeService.getStores();
        res.json(stores);
    } catch (err) {
        logger.error('Error fetching stores:', err);
        res.status(500).json({
            error: 'Failed to fetch stores',
        });
    }
};
