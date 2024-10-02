import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { AppLogRepository } from '../../../../repositories/app-log';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const appLogRepository: typeof AppLogRepository = req.scope.resolve('appLogRepository');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/logs'
    );

    const getUnixTimestamp = () => {
        return Math.floor(Date.now() / 1000);
    }

    await handler.handle(async () => {

        const seconds = handler.hasParam('seconds') ?
            parseInt(handler.inputParams.seconds) :
            (60 * 60 * 24)

        await appLogRepository
            .createQueryBuilder()
            .delete()
            .where('timestamp < :timestamp', {
                timestamp: getUnixTimestamp() - seconds
            })
            .execute()

        return res.json({ ok: 'true' });
    });
};
