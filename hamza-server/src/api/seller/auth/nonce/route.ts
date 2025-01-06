import { generateNonce } from 'siwe';
import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/auth/nonce'
    );

    await handler.handle(async () => {
        const nonce = generateNonce();
        req.session.nonce = nonce;
        await req.session.save();
        handler.returnStatus(200, { nonce: req.session.nonce });
    });
};
