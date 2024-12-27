import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(req, res, 'GET', '/custom/health', ['id']);

    await handler.handle(async () => {
        return handler.returnStatus(200, { status: 'ok' });
    });
};
