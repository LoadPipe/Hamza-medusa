import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { generateNonce } from 'siwe';
import { RouteHandler } from 'src/api/route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(req, res, 'GET', '/checker');
    handler.handle(() => {
        const nonce = generateNonce();
        handler.logger.debug('nonce: ' + nonce);
        handler.logger.debug('typeof nonce: ' + typeof nonce);

        res.json({
            message: nonce,
        });
    });

    /*
    try {
        const nonce = generateNonce();
        logger.debug('nonce: ' + nonce);
        logger.debug('typeof nonce: ' + typeof nonce);

        return res.json({
            message: nonce,
        });
    } catch (error) {
        logger.error(error);
        return res
            .status(500)
            .json({ message: 'Internal server error', error: error.message });
    }
    */
};
