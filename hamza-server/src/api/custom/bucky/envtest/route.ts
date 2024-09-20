import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/envtest'
    );

    await handler.handle(async () => {
        return handler.returnStatus(200, { JWT_SECRET: process.env.JWT_SECRET, COOKIE_SECRET: process.env.COOKIE_SECRET } });
});
};
