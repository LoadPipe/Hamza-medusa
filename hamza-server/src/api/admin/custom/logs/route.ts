import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { AppLogRepository } from '../../../../repositories/app-log';

/**
 * DELETE /admin/custom/logs
 *
 * Purge old logs (older than a specific number of seconds) from the app_logs table. 
 *
 * Query Parameters:
 * - `seconds` (number): Optional number of seconds - any logs older than this number of seconds from the 
 * current date are to be purged
 *
 * Response:
 * - Returns a 200 on success
 * - Returns 500 on failure of any kind
 */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const appLogRepository: typeof AppLogRepository = req.scope.resolve('appLogRepository');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'DELETE', '/admin/custom/logs'
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
