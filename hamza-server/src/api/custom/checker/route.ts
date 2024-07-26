import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { generateNonce } from 'siwe';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(req, res, 'GET', '/custom/checker');

    handler.handle(() => {
        const nonce = generateNonce();
        handler.logger.debug('nonce: ' + nonce);
        handler.logger.debug('typeof nonce: ' + typeof nonce);

        res.json({
            message: nonce,
        });
    });
};
